import { UserBusiness } from '../business/user.business.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { toPublicUser } from '../utils/serializers.js';

export const UserController = {
  assignSupportStaff: asyncHandler(async (req, res) => {
    const user = await UserBusiness.assignSupportStaff(req.body);
    sendSuccess(res, {
      message: 'کاربر با موفقیت به‌عنوان پرسنل پشتیبانی ثبت شد.',
      data: { user: toPublicUser(user) },
    });
  }),
};
