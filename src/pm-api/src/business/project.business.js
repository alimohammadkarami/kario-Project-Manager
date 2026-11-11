import { randomUUID } from 'node:crypto';
import { withTransaction } from '../config/db.js';
import { PROJECT_ROLES } from '../constants/project.js';
import { ProjectModel } from '../models/project.model.js';
import { ProjectMemberModel } from '../models/projectMember.model.js';
import { TaskModel } from '../models/task.model.js';
import { todayInTehran } from '../utils/jalali.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { requireMember, requireOwner } from './projectAccess.js';

/** Groups rows by project_id -> Map<projectId, row[]> */
function groupByProject(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.project_id)) map.set(row.project_id, []);
    map.get(row.project_id).push(row);
  }
  return map;
}

/**
 * Collects everything a project view needs (task counters, overdue tasks, members)
 * with 3 queries for ALL given projects, no matter how many there are.
 */
async function buildDetails(projects) {
  if (projects.length === 0) return [];

  const ids = projects.map((project) => project.id);
  const today = todayInTehran();

  const [stats, overdue, members] = await Promise.all([
    TaskModel.statsByProjectIds(ids, today),
    TaskModel.findOverdueByProjectIds(ids, today),
    ProjectMemberModel.listByProjectIds(ids),
  ]);

  const statsByProject = new Map(stats.map((row) => [row.project_id, row]));
  const overdueByProject = groupByProject(overdue);
  const membersByProject = groupByProject(members);

  return projects.map((project) => ({
    project,
    stats: statsByProject.get(project.id),
    overdueTasks: overdueByProject.get(project.id) ?? [],
    members: membersByProject.get(project.id) ?? [],
  }));
}

async function detailsFor(projectId, userId) {
  const { project, membership } = await requireMember(projectId, userId);
  const [details] = await buildDetails([{ ...project, my_role: membership.role }]);
  return details;
}

export const ProjectBusiness = {
  /** The creator becomes the project manager (owner). */
  async create(user, { title, description, dueDate }) {
    const projectId = randomUUID();

    await withTransaction(async (conn) => {
      await ProjectModel.create(
        { id: projectId, name: title, description, dueDate, createdBy: user.id },
        conn
      );
      await ProjectMemberModel.add(
        { id: randomUUID(), projectId, userId: user.id, role: PROJECT_ROLES.OWNER },
        conn
      );
    });

    return detailsFor(projectId, user.id);
  },

  /** Every project the user belongs to, with full details. */
  async listMine(user, { page, limit, archived }) {
    const { rows, total } = await ProjectModel.listForUser({
      userId: user.id,
      archived,
      limit,
      offset: getOffset(page, limit),
    });
    return { items: await buildDetails(rows), pagination: buildPagination({ page, limit, total }) };
  },

  preview(user, projectId) {
    return detailsFor(projectId, user.id);
  },

  async update(user, projectId, changes) {
    await requireOwner(projectId, user.id);
    await ProjectModel.update(projectId, changes);
    return detailsFor(projectId, user.id);
  },

  /** Physical delete (manager only). Tasks and memberships are removed with it. */
  async remove(user, projectId) {
    await requireOwner(projectId, user.id, { allowArchived: true });
    await ProjectModel.delete(projectId);
  },

  /** Archive / unarchive (manager only). Archived projects are read-only. */
  async setArchived(user, projectId, isArchived) {
    await requireOwner(projectId, user.id, { allowArchived: true });
    await ProjectModel.setArchived(projectId, isArchived);
    return detailsFor(projectId, user.id);
  },
};
