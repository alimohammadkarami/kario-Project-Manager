import { randomUUID } from 'node:crypto';
import { withTransaction } from '../config/db.js';
import { PROJECT_ROLES } from '../constants/project.js';
import { ProjectMemberModel } from '../models/projectMember.model.js';
import { TaskModel } from '../models/task.model.js';
import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { requireMember, requireOwner } from './projectAccess.js';

export const ProjectMemberBusiness = {
  async list(user, projectId) {
    await requireMember(projectId, user.id);
    return ProjectMemberModel.listByProjectId(projectId);
  },

  /** Manager only. The new user joins as a regular member immediately. */
  async add(user, projectId, { email }) {
    await requireOwner(projectId, user.id);

    const target = await UserModel.findByEmail(email);
    if (!target) {
      throw new AppError(404, 'USER_NOT_FOUND', 'کاربر یافت نشد.');
    }
    if (await ProjectMemberModel.find(projectId, target.id)) {
      throw new AppError(409, 'ALREADY_MEMBER', 'این کاربر از قبل عضو پروژه است.');
    }

    await ProjectMemberModel.add({
      id: randomUUID(),
      projectId,
      userId: target.id,
      role: PROJECT_ROLES.MEMBER,
    });
    return ProjectMemberModel.findDetailed(projectId, target.id);
  },

  /**
   * Manager only. The member's tasks stay in the project but become unassigned.
   * Rule: a project must always keep at least one manager.
   */
  async remove(user, projectId, targetUserId) {
    await requireOwner(projectId, user.id);

    const membership = await ProjectMemberModel.find(projectId, targetUserId);
    if (!membership) {
      throw new AppError(404, 'MEMBER_NOT_FOUND', 'این کاربر عضو پروژه نیست.');
    }

    if (
      membership.role === PROJECT_ROLES.OWNER &&
      (await ProjectMemberModel.countOwners(projectId)) <= 1
    ) {
      throw new AppError(
        409,
        'LAST_OWNER',
        'مدیر پروژه قابل حذف نیست. هر پروژه باید همیشه حداقل یک مدیر داشته باشد.'
      );
    }

    await withTransaction(async (conn) => {
      await TaskModel.unassignUserInProject(projectId, targetUserId, conn);
      await ProjectMemberModel.remove(projectId, targetUserId, conn);
    });
  },
};
