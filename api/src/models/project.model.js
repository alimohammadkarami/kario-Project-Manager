import { pool } from '../config/db.js';

const executor = (conn) => conn ?? pool;

// DATE columns are formatted in SQL so they always arrive as 'YYYY-MM-DD' strings
const PROJECT_COLUMNS = `
  p.id, p.name, p.description,
  DATE_FORMAT(p.due_date, '%Y-%m-%d') AS due_date,
  p.is_archived, p.created_by, p.created_at, p.updated_at`;

// whitelist: API field -> column (keeps dynamic UPDATE safe)
const UPDATABLE = { title: 'name', description: 'description', dueDate: 'due_date' };

export const ProjectModel = {
  async create({ id, name, description, dueDate, createdBy }, conn) {
    await executor(conn).execute(
      'INSERT INTO projects (id, name, description, due_date, created_by) VALUES (?, ?, ?, ?, ?)',
      [id, name, description ?? null, dueDate ?? null, createdBy]
    );
  },

  async findById(id, conn) {
    const [rows] = await executor(conn).execute(
      `SELECT ${PROJECT_COLUMNS} FROM projects p WHERE p.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  },

  /** Projects the user is an active member of, newest first (+ the user's role in each). */
  async listForUser({ userId, archived, limit, offset }) {
    const conditions = ['pm.user_id = ?', "pm.status = 'active'"];
    const params = [userId];
    if (archived !== undefined) {
      conditions.push('p.is_archived = ?');
      params.push(archived ? 1 : 0);
    }
    const from = `FROM projects p
                  JOIN project_members pm ON pm.project_id = p.id
                  WHERE ${conditions.join(' AND ')}`;

    const [rows] = await pool.query(
      `SELECT ${PROJECT_COLUMNS}, pm.role AS my_role ${from}
       ORDER BY p.created_at DESC, p.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total ${from}`, params);

    return { rows, total: Number(total) };
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
    await executor(conn).execute(`UPDATE projects SET ${sets.join(', ')} WHERE id = ?`, [
      ...params,
      id,
    ]);
  },

  async setArchived(id, isArchived, conn) {
    await executor(conn).execute('UPDATE projects SET is_archived = ? WHERE id = ?', [
      isArchived ? 1 : 0,
      id,
    ]);
  },

  /** Physical delete. Members and tasks go with it (ON DELETE CASCADE). */
  async delete(id, conn) {
    await executor(conn).execute('DELETE FROM projects WHERE id = ?', [id]);
  },
};
