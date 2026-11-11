import { ProjectMemberBusiness } from '../business/projectMember.business.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toMember } from '../utils/project.serializer.js';
import { sendSuccess } from '../utils/response.js';

export const ProjectMemberController = {
  list: asyncHandler(async (req, res) => {
    const members = await ProjectMemberBusiness.list(req.user, req.params.projectId);
    sendSuccess(res, { data: { members: members.map(toMember) } });
  }),

  add: asyncHandler(async (req, res) => {
    const member = await ProjectMemberBusiness.add(req.user, req.params.projectId, req.body);
    sendSuccess(res, {
      statusCode: 201,
      message: 'کاربر با موفقیت به پروژه اضافه شد.',
      data: { member: toMember(member) },
    });
  }),

  remove: asyncHandler(async (req, res) => {
    await ProjectMemberBusiness.remove(req.user, req.params.projectId, req.params.userId);
    sendSuccess(res, { message: 'کاربر از پروژه حذف شد.' });
  }),
};
