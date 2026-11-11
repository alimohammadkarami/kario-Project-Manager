import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/response.js';

/** Single place where every error becomes a response. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return sendError(res, {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  // malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return sendError(res, {
      statusCode: 400,
      code: 'INVALID_JSON',
      message: 'ساختار JSON ارسال‌شده معتبر نیست.',
    });
  }

  if (err.type === 'entity.too.large') {
    return sendError(res, {
      statusCode: 413,
      code: 'PAYLOAD_TOO_LARGE',
      message: 'حجم درخواست بیش از حد مجاز است.',
    });
  }

  // race condition: two requests registered the same email at the same time
  if (err.code === 'ER_DUP_ENTRY' && String(err.sqlMessage).includes('uq_users_email')) {
    return sendError(res, {
      statusCode: 409,
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'این ایمیل قبلاً ثبت‌نام کرده است.',
    });
  }

  // race condition: the same user was added to the same project twice at once
  if (err.code === 'ER_DUP_ENTRY' && String(err.sqlMessage).includes('uq_project_members_project_user')) {
    return sendError(res, {
      statusCode: 409,
      code: 'ALREADY_MEMBER',
      message: 'این کاربر از قبل عضو پروژه است.',
    });
  }

  console.error(`[error] ${req.method} ${req.originalUrl}`, err);

  return sendError(res, {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'خطای داخلی سرور. لطفاً بعداً دوباره تلاش کنید.',
    details: config.isProd ? null : { reason: err.message },
  });
}
