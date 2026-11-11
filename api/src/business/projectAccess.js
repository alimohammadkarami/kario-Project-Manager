import { MEMBER_STATUS, PROJECT_ROLES } from '../constants/project.js';
import { ProjectModel } from '../models/project.model.js';
import { ProjectMemberModel } from '../models/projectMember.model.js';
import { AppError } from '../utils/AppError.js';

/**
 * Who may do what inside a project. One place, reused by every project-related
 * business module, so the rules can never drift apart.
 *
 *   requireMember -> any active member of the project
 *   requireOwner  -> only the project manager (also blocks archived projects,
 *                    which are read-only, unless allowArchived is set)
 *
 * Non-members get "not found" (not "forbidden") so project ids can't be probed.
 */

const projectNotFound = () => new AppError(404, 'PROJECT_NOT_FOUND', 'پروژه موردنظر یافت نشد.');

export async function requireMember(projectId, userId, { notFound = projectNotFound } = {}) {
  const project = await ProjectModel.findById(projectId);
  if (!project) throw notFound();

  const membership = await ProjectMemberModel.find(projectId, userId);
  if (!membership || membership.status !== MEMBER_STATUS.ACTIVE) throw notFound();

  return { project, membership };
}

export function assertWritable(project) {
  if (project.is_archived) {
    throw new AppError(
      409,
      'PROJECT_ARCHIVED',
      'این پروژه آرشیو شده است و فقط قابل مشاهده است. برای ایجاد تغییر، ابتدا آن را از آرشیو خارج کنید.'
    );
  }
}

export async function requireOwner(
  projectId,
  userId,
  { allowArchived = false, notFound = projectNotFound } = {}
) {
  const context = await requireMember(projectId, userId, { notFound });

  if (context.membership.role !== PROJECT_ROLES.OWNER) {
    throw new AppError(403, 'FORBIDDEN', 'فقط مدیر پروژه می‌تواند این عملیات را انجام دهد.');
  }
  if (!allowArchived) assertWritable(context.project);

  return context;
}
