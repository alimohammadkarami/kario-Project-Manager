import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';

const MINUTE = 60 * 1000;

const createLimiter = ({ windowMs, limit, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests,
    standardHeaders: 'draft-7', // RateLimit-* headers
    legacyHeaders: false,
    // hand over to the central error handler so the response shape stays consistent
    handler: (req, res, next) => next(new AppError(429, 'RATE_LIMITED', message)),
  });

/** Applied to the whole API. */
export const globalLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 300,
  message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.',
});

export const registerLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  limit: 10,
  message: 'تعداد تلاش‌های ثبت‌نام زیاد است. لطفاً یک ساعت دیگر دوباره تلاش کنید.',
});

// successful logins are not counted, only failed attempts
export const loginLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'تعداد تلاش‌های ورود ناموفق زیاد است. لطفاً ۱۵ دقیقه دیگر دوباره تلاش کنید.',
});

export const sendCodeLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 5,
  message: 'تعداد درخواست‌های ارسال کد زیاد است. لطفاً ۱۵ دقیقه دیگر دوباره تلاش کنید.',
});

export const verifyCodeLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 10,
  message: 'تعداد تلاش‌های تأیید کد زیاد است. لطفاً ۱۵ دقیقه دیگر دوباره تلاش کنید.',
});

export const resetPasswordLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 5,
  message: 'تعداد درخواست‌های تغییر رمز عبور زیاد است. لطفاً ۱۵ دقیقه دیگر دوباره تلاش کنید.',
});
