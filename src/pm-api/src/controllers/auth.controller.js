import { AuthBusiness } from '../business/auth.business.js';
import { config } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { toPublicUser } from '../utils/serializers.js';

/**
 * HTTP layer only: read the request, call the business layer, shape the response.
 * No rules and no SQL in here.
 */

const sessionPayload = ({ user, token }) => ({
  user: toPublicUser(user),
  token,
  tokenType: 'Bearer',
  expiresIn: config.jwt.expiresIn,
});

export const AuthController = {
  register: asyncHandler(async (req, res) => {
    const session = await AuthBusiness.register(req.body);
    sendSuccess(res, {
      statusCode: 201,
      message: 'ثبت‌نام با موفقیت انجام شد.',
      data: sessionPayload(session),
    });
  }),

  login: asyncHandler(async (req, res) => {
    const session = await AuthBusiness.login(req.body);
    sendSuccess(res, {
      message: 'ورود با موفقیت انجام شد.',
      data: sessionPayload(session),
    });
  }),

  sendVerificationCode: asyncHandler(async (req, res) => {
    await AuthBusiness.sendPasswordResetCode(req.body);
    sendSuccess(res, {
      message: 'اگر حساب کاربری با این ایمیل وجود داشته باشد، کد تأیید برای آن ارسال می‌شود.',
      data: {
        expiresInMinutes: config.otp.ttlMinutes,
        resendAfterSeconds: config.otp.resendCooldownSeconds,
      },
    });
  }),

  verifyCode: asyncHandler(async (req, res) => {
    const data = await AuthBusiness.verifyPasswordResetCode(req.body);
    sendSuccess(res, { message: 'کد تأیید با موفقیت تأیید شد.', data });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await AuthBusiness.resetPassword(req.body);
    sendSuccess(res, { message: 'رمز عبور با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.' });
  }),

  modifyInfo: asyncHandler(async (req, res) => {
    const user = await AuthBusiness.modifyInfo(req.user.id, req.body);
    sendSuccess(res, {
      message: 'اطلاعات شما با موفقیت به‌روزرسانی شد.',
      data: { user: toPublicUser(user) },
    });
  }),
  modifyPassword: asyncHandler(async (req, res) => {
    const user = await AuthBusiness.ChangePassword(req.user.id, req.body);
    sendSuccess(res, {
      message: 'رمز عبور  شما با موفقیت به‌روزرسانی شد.',
      data: { user: toPublicUser(user) },
    });
  }),
  me: asyncHandler(async (req, res) => {
    sendSuccess(res, { data: { user: toPublicUser(req.user) } });
  }),
};
