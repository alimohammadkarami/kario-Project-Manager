import { pool } from '../config/db.js';

const executor = (conn) => conn ?? pool;

const MEMBER_SELECT = `
  SELECT pm.project_id, pm.user_id, pm.role, pm.status, pm.joined_at,
         u.full_name, u.email , u.avatar_name 
  FROM project_members pm
  JOIN users u ON u.id = pm.user_id`;

export const ProjectMemberModel = {
  async add({ id, projectId, userId, role }, conn) {
    await executor(conn).execute(
      'INSERT INTO project_members (id, project_id, user_id, role) VALUES (?, ?, ?, ?)',
      [id, projectId, userId, role]
    );
  },

  async find(projectId, userId, conn) {
    const [rows] = await executor(conn).execute(
      'SELECT * FROM project_members WHERE project_id = ? AND user_id = ? LIMIT 1',
      [projectId, userId]
    );
    return rows[0] ?? null;
  },

  /** One member with name/avatar. */
  async findDetailed(projectId, userId) {
    const [rows] = await pool.execute(
      `${MEMBER_SELECT} WHERE pm.project_id = ? AND pm.user_id = ? LIMIT 1`,
      [projectId, userId]
    );
    return rows[0] ?? null;
  },

  /** Active members of one project: manager first, then by join date. */
  async listByProjectId(projectId) {
    const [rows] = await pool.execute(
      `${MEMBER_SELECT} WHERE pm.project_id = ? AND pm.status = 'active'
       ORDER BY pm.role = 'owner' DESC, pm.joined_at ASC`,
      [projectId]
    );
    return rows;
  },

  /** Same, for many projects at once (used by the project list / preview). */
  async listByProjectIds(projectIds) {
    const [rows] = await pool.query(
      `${MEMBER_SELECT} WHERE pm.project_id IN (?) AND pm.status = 'active'
       ORDER BY pm.role = 'owner' DESC, pm.joined_at ASC`,
      [projectIds]
    );
    return rows;
  },

  async countOwners(projectId, conn) {
    const [rows] = await executor(conn).execute(
      "SELECT COUNT(*) AS total FROM project_members WHERE project_id = ? AND role = 'owner'",
      [projectId]
    );
    return Number(rows[0].total);
  },

  async remove(projectId, userId, conn) {
    await executor(conn).execute(
      'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, userId]
    );
  },
};
