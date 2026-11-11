import { TASK_STATUS, TASK_STATUS_LABELS } from '../constants/task.js';
import { formatJalaliDate, formatJalaliFromDateString, todayInTehran } from './jalali.js';

export function toTask(row, today = todayInTehran()) {
  const task = {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    statusLabel: TASK_STATUS_LABELS[row.status],
    createdAt: row.created_at,
    createdDate: formatJalaliDate(row.created_at),
    dueDate: formatJalaliFromDateString(row.due_date),
    isOverdue: Boolean(row.due_date) && row.due_date < today && row.status !== TASK_STATUS.DONE,
    statusChangedAt: row.status_changed_at,
    assignee: row.assignee_id
      ? { id: row.assignee_id, fullName: row.assignee_name, avatarName: row.assignee_avatar_name }
      : null,
  };

  // present only for "my tasks" (rows joined with their project)
  if (row.project_name !== undefined) {
    task.project = {
      id: row.project_id,
      title: row.project_name,
      isArchived: Boolean(row.project_is_archived),
    };
  }

  return task;
}
