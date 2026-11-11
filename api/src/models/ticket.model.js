import { pool } from '../config/db.js';

const executor = (conn) => conn ?? pool;

// Ticket + its owner + (optional) the support member who answered it.
const DETAIL_SELECT = `
  SELECT t.*,
         u.full_name AS user_full_name,
         u.email     AS user_email,
         s.full_name AS answered_by_name
  FROM tickets t
  JOIN users u ON u.id = t.user_id
  LEFT JOIN users s ON s.id = t.answered_by`;

export const TicketModel = {
  /** Returns the auto-increment id of the new row. */
  async create({ userId, title, description, createdAt }, conn) {
    const [result] = await executor(conn).execute(
      'INSERT INTO tickets (user_id, title, description, created_at) VALUES (?, ?, ?, ?)',
      [userId, title, description, createdAt]
    );
    return result.insertId;
  },

  async setTrackingCode(id, trackingCode, conn) {
    await executor(conn).execute('UPDATE tickets SET tracking_code = ? WHERE id = ?', [
      trackingCode,
      id,
    ]);
  },

  async findDetailedById(id, conn) {
    const [rows] = await executor(conn).execute(`${DETAIL_SELECT} WHERE t.id = ? LIMIT 1`, [id]);
    return rows[0] ?? null;
  },

  /** Paginated list, newest first. Optional filters: userId, status. */
  async list({ userId, status, limit, offset }) {
    const conditions = [];
    const params = [];
    if (userId) {
      conditions.push('t.user_id = ?');
      params.push(userId);
    }
    if (status) {
      conditions.push('t.status = ?');
      params.push(status);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // pool.query (not execute): LIMIT/OFFSET placeholders are unreliable in prepared statements
    const [rows] = await pool.query(
      `${DETAIL_SELECT} ${where} ORDER BY t.created_at DESC, t.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM tickets t ${where}`,
      params
    );

    return { rows, total: Number(total) };
  },

  /**
   * Stores the single answer. The `status = 'pending'` condition makes this atomic:
   * if two staff members answer at once, only one UPDATE matches.
   * Returns true when this call is the one that answered the ticket.
   */
  async answer(id, { answer, answeredBy, answeredAt }, conn) {
    const [result] = await executor(conn).execute(
      `UPDATE tickets
       SET answer = ?, answered_by = ?, answered_at = ?, status = 'answered'
       WHERE id = ? AND status = 'pending'`,
      [answer, answeredBy, answeredAt, id]
    );
    return result.affectedRows === 1;
  },
};
