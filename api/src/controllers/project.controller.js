import { ProjectBusiness } from '../business/project.business.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toProjectDetail } from '../utils/project.serializer.js';
import { sendSuccess } from '../utils/response.js';

export const ProjectController = {
  create: asyncHandler(async (req, res) => {
    const details = await ProjectBusiness.create(req.user, req.body);
    sendSuccess(res, {
      statusCode: 201,
      message: 'پروژه با موفقیت ایجاد شد.',
      data: { project: toProjectDetail(details) },
    });
  }),

  listMine: asyncHandler(async (req, res) => {
    const { items, pagination } = await ProjectBusiness.listMine(req.user, req.query);
    sendSuccess(res, { data: { projects: items.map(toProjectDetail), pagination } });
  }),

  preview: asyncHandler(async (req, res) => {
    const details = await ProjectBusiness.preview(req.user, req.params.projectId);
    sendSuccess(res, { data: { project: toProjectDetail(details) } });
  }),

  update: asyncHandler(async (req, res) => {
    const details = await ProjectBusiness.update(req.user, req.params.projectId, req.body);
    sendSuccess(res, {
      message: 'پروژه با موفقیت ویرایش شد.',
      data: { project: toProjectDetail(details) },
    });
  }),

  remove: asyncHandler(async (req, res) => {
    await ProjectBusiness.remove(req.user, req.params.projectId);
    sendSuccess(res, { message: 'پروژه با موفقیت حذف شد.' });
  }),

  archive: asyncHandler(async (req, res) => {
    const details = await ProjectBusiness.setArchived(
      req.user,
      req.params.projectId,
      req.body.isArchived
    );
    sendSuccess(res, {
      message: req.body.isArchived
        ? 'پروژه با موفقیت آرشیو شد.'
        : 'پروژه از آرشیو خارج شد.',
      data: { project: toProjectDetail(details) },
    });
  }),
};
