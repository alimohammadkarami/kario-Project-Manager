import { randomUUID } from 'node:crypto';
import { config } from '../config/env.js';
import { withTransaction } from '../config/db.js';
import { UserModel } from '../models/user.model.js';
import { VerificationCodeModel } from '../models/verificationCode.model.js';
import { MailService } from '../services/mail.service.js';
import { AppError } from '../utils/AppError.js';
import { buildAvatarName } from '../utils/avatar.js';
import {
  generateNumericCode,
  generateOpaqueToken,
  hashCode,
  safeEqual,
  sha256,
} from '../utils/crypto.js';
import { signAccessToken } from '../utils/jwt.js';
import { comparePassword, fakeComparePassword, hashPassword } from '../utils/password.js';

/**
 * Auth business rules.
 * No req/res here: input is plain data, output is plain data, failures are AppErrors.
 */

const PASSWORD_RESET = 'password_reset';
const minutesFromNow = (minutes) => new Date(Date.now() + minutes * 60 * 1000);

const invalidCredentials = () =>
  new AppError(401, 'INVALID_CREDENTIALS', 'ایمیل یا رمز عبور اشتباه است.');

const invalidResetToken = () =>
  new AppError(
    400,
    'INVALID_RESET_TOKEN',
    'اعتبار این درخواست تمام شده است. لطفاً فرآیند بازیابی رمز عبور را از ابتدا انجام دهید.'
  );

const issueSession = (user) => ({ user, token: signAccessToken(user.id) });

export const AuthBusiness = {
  async register({ fullName, email, password }) {
    if (await UserModel.findByEmail(email)) {
      throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'این ایمیل قبلاً ثبت‌نام کرده است.');
    }

    const id = randomUUID();
    await UserModel.create({
      id,
      fullName,
      email,
      passwordHash: await hashPassword(password),
      avatarName: buildAvatarName(fullName),
    });

    return issueSession(await UserModel.findById(id));
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      await fakeComparePassword(password); // keep timing equal to the "user exists" path
      throw invalidCredentials();
    }

    if (!(await comparePassword(password, user.password_hash))) {
      throw invalidCredentials();
    }

    return issueSession(user);
  },

  /**
   * Step 1 of password reset: email a 6-digit code.
   * Always resolves the same way whether the email exists or not,
   * so this route cannot be used to discover registered emails.
   */
  async sendPasswordResetCode({ email }) {
    const user = await UserModel.findByEmail(email);
    if (!user) return;

    // resend cooldown: silently ignore requests that come too early
    const latest = await VerificationCodeModel.findLatest(email, PASSWORD_RESET);
    const cooldownMs = config.otp.resendCooldownSeconds * 1000;
    if (latest && !latest.used_at && Date.now() - latest.created_at.getTime() < cooldownMs) {
      return;
    }

    const code = generateNumericCode(6);

    await withTransaction(async (conn) => {
      await VerificationCodeModel.invalidateOpen(email, PASSWORD_RESET, conn);
      await VerificationCodeModel.create(
        {
          id: randomUUID(),
          email,
          purpose: PASSWORD_RESET,
          codeHash: hashCode(code),
          expiresAt: minutesFromNow(config.otp.ttlMinutes),
        },
        conn
      );
    });

    try {
      await MailService.sendPasswordResetCode({
        to: email,
        fullName: user.full_name,
        code,
        ttlMinutes: config.otp.ttlMinutes,
      });
    } catch (error) {
      console.error('[mail] failed to send password reset code:', error.message);
      await VerificationCodeModel.invalidateOpen(email, PASSWORD_RESET);
      throw new AppError(
        502,
        'EMAIL_SEND_FAILED',
        'ارسال ایمیل با مشکل مواجه شد. لطفاً کمی بعد دوباره تلاش کنید.'
      );
    }
  },

  /**
   * Step 2: check the code. On success returns a short-lived, single-use
   * `resetToken` that authorizes exactly one password change.
   */
  async verifyPasswordResetCode({ email, code }) {
    const record = await VerificationCodeModel.findLatest(email, PASSWORD_RESET);

    const isOpen =
      record && !record.used_at && !record.verified_at && record.expires_at.getTime() > Date.now();

    if (!isOpen) {
      throw new AppError(
        400,
        'CODE_EXPIRED',
        'کد تأیید منقضی شده یا معتبر نیست. لطفاً کد جدید دریافت کنید.'
      );
    }

    if (record.attempts >= config.otp.maxAttempts) {
      throw new AppError(
        429,
        'TOO_MANY_ATTEMPTS',
        'تعداد تلاش‌های اشتباه بیش از حد مجاز است. لطفاً کد جدید دریافت کنید.'
      );
    }

    if (!safeEqual(hashCode(code), record.code_hash)) {
      await VerificationCodeModel.incrementAttempts(record.id);
      const remaining = config.otp.maxAttempts - record.attempts - 1;
      throw new AppError(
        400,
        'INVALID_CODE',
        remaining > 0
          ? `کد تأیید اشتباه است. ${remaining} تلاش دیگر باقی مانده است.`
          : 'کد تأیید اشتباه است. لطفاً کد جدید دریافت کنید.'
      );
    }

    const resetToken = generateOpaqueToken();
    await VerificationCodeModel.markVerified(record.id, {
      resetTokenHash: sha256(resetToken),
      resetTokenExpiresAt: minutesFromNow(config.otp.resetTokenTtlMinutes),
    });

    return { resetToken, expiresInMinutes: config.otp.resetTokenTtlMinutes };
  },

  /** Step 3: set the new password using the token from step 2. */
  async resetPassword({ resetToken, password }) {
    const record = await VerificationCodeModel.findByResetTokenHash(sha256(resetToken));

    if (
      !record ||
      record.used_at ||
      !record.reset_token_expires_at ||
      record.reset_token_expires_at.getTime() <= Date.now()
    ) {
      throw invalidResetToken();
    }

    const user = await UserModel.findByEmail(record.email);
    if (!user) throw invalidResetToken();

    const passwordHash = await hashPassword(password);

    await withTransaction(async (conn) => {
      // atomic "use once": only one concurrent request can win this update
      if (!(await VerificationCodeModel.markUsed(record.id, conn))) {
        throw invalidResetToken();
      }
      await UserModel.updatePassword(user.id, passwordHash, conn);
    });
  },

  async modifyInfo(userId, { fullName }) {
    await UserModel.updateName(userId, { fullName, avatarName: buildAvatarName(fullName) });
    return UserModel.findById(userId);
  },
};
