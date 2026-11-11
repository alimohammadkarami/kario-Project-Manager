import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Expects:  Authorization: Bearer <token>
 * On success sets req.user to the user's DB row.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'برای دسترسی به این بخش باید وارد حساب کاربری شوید.');
  }

  let payload;
  try {
    payload = verifyAccessToken(header.slice(7).trim());
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(401, 'TOKEN_EXPIRED', 'نشست شما منقضی شده است. دوباره وارد شوید.');
    }
    throw new AppError(401, 'INVALID_TOKEN', 'توکن ارسال‌شده معتبر نیست.');
  }

  // Hitting the DB makes deleted users lose access immediately.
  const user = await UserModel.findById(payload.sub);
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'حساب کاربری یافت نشد. دوباره وارد شوید.');
  }

  req.user = user;
  next();
});
