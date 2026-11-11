import { ROLES } from '../constants/roles.js';
import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';

export const UserBusiness = {
  /** Promotes the user with this email to support staff. */
  async assignSupportStaff({ email }) {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'کاربری با این ایمیل یافت نشد.');
    }
    if (user.role === ROLES.ADMIN) {
      throw new AppError(409, 'ROLE_NOT_CHANGEABLE', 'نقش مدیر پلتفرم قابل تغییر نیست.');
    }
    if (user.role === ROLES.SUPPORT) {
      throw new AppError(409, 'ALREADY_SUPPORT_STAFF', 'این کاربر از قبل پرسنل پشتیبانی است.');
    }

    await UserModel.updateRole(user.id, ROLES.SUPPORT);
    return UserModel.findById(user.id);
  },
};
