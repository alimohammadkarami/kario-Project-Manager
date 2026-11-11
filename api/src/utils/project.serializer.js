import { PROJECT_ROLE_LABELS } from '../constants/project.js';
import { formatJalaliDate, formatJalaliFromDateString } from './jalali.js';

export const toMember = (row) => ({
  userId: row.user_id,
  fullName: row.full_name,
  avatarName: row.avatar_name,
  role: row.role,
  roleLabel: PROJECT_ROLE_LABELS[row.role],
  joinedAt: row.joined_at,
  joinedDate: formatJalaliDate(row.joined_at),
});

const EMPTY_STATS = { total: 0, todo: 0, in_progress: 0, done: 0, overdue: 0 };

/**
 * Full project view (used by preview and by the project list).
 * `details` = { project, stats, overdueTasks, members } built by ProjectBusiness.
 */
export function toProjectDetail({ project, stats = EMPTY_STATS, overdueTasks, members }) {
  const total = Number(stats.total);
  const done = Number(stats.done);

  return {
    id: project.id,
    title: project.name,
    description: project.description,
    isArchived: Boolean(project.is_archived),
    myRole: project.my_role,
    createdAt: project.created_at,
    createdDate: formatJalaliDate(project.created_at),
    dueDate: formatJalaliFromDateString(project.due_date),
    progress: total === 0 ? 0 : Math.round((done / total) * 100), // percent of done tasks
    membersCount: members.length,
    tasks: {
      total,
      todo: Number(stats.todo),
      inProgress: Number(stats.in_progress),
      done,
    },
    overdueCount: Number(stats.overdue),
    overdueTasks: overdueTasks.map((task) => ({
      id: task.id,
      title: task.title,
      dueDate: formatJalaliFromDateString(task.due_date),
    })),
    members: members.map(toMember),
  };
}
