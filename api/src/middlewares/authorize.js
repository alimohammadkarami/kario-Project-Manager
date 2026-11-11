import { AppError } from '../utils/AppError.js';

/**
 * Role guard. Always place it AFTER `authenticate`.
 *   router.get('/', authenticate, authorize(ROLES.SUPPORT), handler)
 * The role is read from the database on every request (see `authenticate`),
 * so a role change takes effect immediately, without a new login.
 */
export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(403, 'FORBIDDEN', 'شما دسترسی لازم برای انجام این عملیات را ندارید.')
      );
    }
    return next();
  };
