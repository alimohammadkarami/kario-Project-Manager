import { pool } from '../config/db.js';

const executor = (conn) => conn ?? pool;

const TASK_COLUMNS = `
  t.id, t.project_id, t.title, t.description, t.assignee_id, t.status,
  DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date,
  t.created_by, t.created_at, t.status_changed_at,
  a.full_name AS assignee_name, a.avatar_name AS assignee_avatar_name`;

const TASK_FROM = `
  FROM tasks t
  LEFT JOIN users a ON a.id = t.assignee_id`;

// whitelist: API field -> column (keeps dynamic UPDATE safe)
const UPDATABLE = {
  title: 'title',
  description: 'description',
  dueDate: 'due_date',
  assigneeId: 'assignee_id',
};

async function paginate({ select, from, conditions, params, limit, offset }) {
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  // pool.query (not execute): LIMIT/OFFSET placeholders are unreliable in prepared statements
  const [rows] = await pool.query(
    `${select} ${from} ${where} ORDER BY t.created_at DESC, t.id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total ${from} ${where}`, params);
  return { rows, total: Number(total) };
}

export const TaskModel = {
  async create({ id, projectId, title, description, dueDate, assigneeId, createdBy }, conn) {
    await executor(conn).execute(
      `INSERT INTO tasks (id, project_id, title, description, due_date, assignee_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, projectId, title, description ?? null, dueDate ?? null, assigneeId ?? null, createdBy]
    );
  },

  /** Task + assignee name. */
  async findById(id, conn) {
    const [rows] = await executor(conn).execute(
      `SELECT ${TASK_COLUMNS} ${TASK_FROM} WHERE t.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  },

  async listByProject({ projectId, status, limit, offset }) {
    const conditions = ['t.project_id = ?'];
    const params = [projectId];
    if (status) {
      conditions.push('t.status = ?');
      params.push(status);
    }
    return paginate({
      select: `SELECT ${TASK_COLUMNS}`,
      from: TASK_FROM,
      conditions,
      params,
      limit,
      offset,
    });
  },

  /** Tasks assigned to one user across all projects (+ the project they belong to). */
  async listByAssignee({ userId, status, limit, offset }) {
    const conditions = ['t.assignee_id = ?'];
    const params = [userId];
    if (status) {
      conditions.push('t.status = ?');
      params.push(status);
    }
    return paginate({
      select: `SELECT ${TASK_COLUMNS}, p.name AS project_name, p.is_archived AS project_is_archived`,
      from: `${TASK_FROM} JOIN projects p ON p.id = t.project_id`,
      conditions,
      params,
      limit,
      offset,
    });
  },

  async update(id, changes, conn) {
    const sets = [];
    const params = [];
    for (const [key, column] of Object.entries(UPDATABLE)) {
      if (changes[key] !== undefined) {
        sets.push(`${column} = ?`);
        params.push(changes[key]);
      }
    }
    if (sets.length === 0) return;
    await executor(conn).execute(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`, [
      ...params,
      id,
    ]);
  },

  async updateStatus(id, status, conn) {
    await executor(conn).execute(
      'UPDATE tasks SET status = ?, status_changed_at = ? WHERE id = ?',
      [status, new Date(), id]
    );
  },

  async delete(id, conn) {
    await executor(conn).execute('DELETE FROM tasks WHERE id = ?', [id]);
  },

  /** Used when a member leaves/is removed: their tasks stay, but become unassigned. */
  async unassignUserInProject(projectId, userId, conn) {
    await executor(conn).execute(
      'UPDATE tasks SET assignee_id = NULL WHERE project_id = ? AND assignee_id = ?',
      [projectId, userId]
    );
  },

  /** Per-project counters: total, todo, in_progress, done, overdue. */
  async statsByProjectIds(projectIds, today) {
    const [rows] = await pool.query(
      `SELECT project_id,
              COUNT(*)                                   AS total,
              SUM(status = 'todo')                       AS todo,
              SUM(status = 'in_progress')                AS in_progress,
              SUM(status = 'done')                       AS done,
              SUM(status <> 'done' AND due_date IS NOT NULL AND due_date < ?) AS overdue
       FROM tasks
       WHERE project_id IN (?)
       GROUP BY project_id`,
      [today, projectIds]
    );
    return rows;
  },

  /** Not-done tasks whose due date is before `today` (a task due today is not overdue yet). */
  async findOverdueByProjectIds(projectIds, today) {
    const [rows] = await pool.query(
      `SELECT id, project_id, title, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date
       FROM tasks
       WHERE project_id IN (?) AND status <> 'done' AND due_date IS NOT NULL AND due_date < ?
       ORDER BY due_date ASC, created_at ASC`,
      [projectIds, today]
    );
    return rows;
  },
};
