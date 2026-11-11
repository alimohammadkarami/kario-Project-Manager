import { TaskBusiness } from '../business/task.business.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { toTask } from '../utils/task.serializer.js';

export const TaskController = {
  create: asyncHandler(async (req, res) => {
    const task = await TaskBusiness.create(req.user, req.params.projectId, req.body);
    sendSuccess(res, {
      statusCode: 201,
      message: 'تسک با موفقیت ایجاد شد.',
      data: { task: toTask(task) },
    });
  }),

  listByProject: asyncHandler(async (req, res) => {
    const { rows, pagination } = await TaskBusiness.listByProject(
      req.user,
      req.params.projectId,
      req.query
    );
    sendSuccess(res, { data: { tasks: rows.map((row) => toTask(row)), pagination } });
  }),

  listMine: asyncHandler(async (req, res) => {
    const { rows, pagination } = await TaskBusiness.listMine(req.user, req.query);
    sendSuccess(res, { data: { tasks: rows.map((row) => toTask(row)), pagination } });
  }),

  update: asyncHandler(async (req, res) => {
    const task = await TaskBusiness.update(req.user, req.params.taskId, req.body);
    sendSuccess(res, { message: 'تسک با موفقیت ویرایش شد.', data: { task: toTask(task) } });
  }),

  remove: asyncHandler(async (req, res) => {
    await TaskBusiness.remove(req.user, req.params.taskId);
    sendSuccess(res, { message: 'تسک با موفقیت حذف شد.' });
  }),

  changeStatus: asyncHandler(async (req, res) => {
    const task = await TaskBusiness.changeStatus(req.user, req.params.taskId, req.body);
    sendSuccess(res, {
      message: 'وضعیت تسک با موفقیت تغییر کرد.',
      data: { task: toTask(task) },
    });
  }),
};
