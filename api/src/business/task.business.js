import { randomUUID } from 'node:crypto';
import { MEMBER_STATUS } from '../constants/project.js';
import { ProjectModel } from '../models/project.model.js';
import { ProjectMemberModel } from '../models/projectMember.model.js';
import { TaskModel } from '../models/task.model.js';
import { AppError } from '../utils/AppError.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { assertWritable, requireMember, requireOwner } from './projectAccess.js';

// For routes addressed by task id: don't reveal that the project exists to non-members
const taskNotFound = () => new AppError(404, 'TASK_NOT_FOUND', 'تسک موردنظر یافت نشد.');

async function findTaskOrFail(taskId) {
  const task = await TaskModel.findById(taskId);
  if (!task) throw taskNotFound();
  return task;
}

/** The assignee must be an active member of the same project. */
async function assertAssigneeIsMember(projectId, assigneeId) {
  if (!assigneeId) return;
  const membership = await ProjectMemberModel.find(projectId, assigneeId);
  if (!membership || membership.status !== MEMBER_STATUS.ACTIVE) {
    throw new AppError(
      422,
      'ASSIGNEE_NOT_MEMBER',
      'مسئول تسک باید یکی از اعضای همین پروژه باشد.'
    );
  }
}

async function listPage(fetchPage, { page, limit, status }) {
  const { rows, total } = await fetchPage({ status, limit, offset: getOffset(page, limit) });
  return { rows, pagination: buildPagination({ page, limit, total }) };
}

export const TaskBusiness = {
  /** Manager only. */
  async create(user, projectId, { title, description, dueDate, assigneeId }) {
    await requireOwner(projectId, user.id);
    await assertAssigneeIsMember(projectId, assigneeId);

    const id = randomUUID();
    await TaskModel.create({
      id,
      projectId,
      title,
      description,
      dueDate,
      assigneeId,
      createdBy: user.id,
    });
    return TaskModel.findById(id);
  },

  /** Any member of the project. */
  async listByProject(user, projectId, query) {
    await requireMember(projectId, user.id);
    return listPage((args) => TaskModel.listByProject({ projectId, ...args }), query);
  },

  /** Tasks assigned to the logged-in user, across all projects. */
  listMine(user, query) {
    return listPage((args) => TaskModel.listByAssignee({ userId: user.id, ...args }), query);
  },

  /** Manager only. Partial update; `assigneeId: null` un-assigns the task. */
  async update(user, taskId, changes) {
    const task = await findTaskOrFail(taskId);
    await requireOwner(task.project_id, user.id, { notFound: taskNotFound });
    await assertAssigneeIsMember(task.project_id, changes.assigneeId);

    await TaskModel.update(taskId, changes);
    return TaskModel.findById(taskId);
  },

  /** Manager only. */
  async remove(user, taskId) {
    const task = await findTaskOrFail(taskId);
    await requireOwner(task.project_id, user.id, { notFound: taskNotFound });
    await TaskModel.delete(taskId);
  },

  /**
   * The only task action that does NOT depend on the project manager:
   * the assignee (and nobody else) moves their own task between statuses.
   */
  async changeStatus(user, taskId, { status }) {
    const task = await findTaskOrFail(taskId);

    if (!task.assignee_id) {
      throw new AppError(
        409,
        'TASK_NOT_ASSIGNED',
        'تا زمانی که برای تسک مسئولی تعیین نشده، امکان تغییر وضعیت آن وجود ندارد.'
      );
    }
    if (task.assignee_id !== user.id) {
      throw new AppError(403, 'NOT_TASK_ASSIGNEE', 'شما فقط می‌توانید وضعیت تسک‌های خودتان را تغییر دهید.');
    }

    assertWritable(await ProjectModel.findById(task.project_id)); // archived projects are read-only

    if (task.status !== status) {
      await TaskModel.updateStatus(taskId, status);
    }
    return TaskModel.findById(taskId);
  },
};
