import { pool } from '../config/db.js';

/**
 * Data access for the `users` table. SQL only - no business rules here.
 * Every method accepts an optional connection so it can join a transaction.
 */
const executor = (conn) => conn ?? pool;

export const UserModel = {
  async findById(id, conn) {
    const [rows] = await executor(conn).execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] ?? null;
  },

  async findByEmail(email, conn) {
    const [rows] = await executor(conn).execute('SELECT * FROM users WHERE email = ? LIMIT 1', [
      email,
    ]);
    return rows[0] ?? null;
  },

  async create({ id, fullName, email, passwordHash, avatarName }, conn) {
    await executor(conn).execute(
      `INSERT INTO users (id, full_name, email, password_hash, avatar_name)
       VALUES (?, ?, ?, ?, ?)`,
      [id, fullName, email, passwordHash, avatarName]
    );
  },

  async updateName(id, { fullName, avatarName }, conn) {
    await executor(conn).execute('UPDATE users SET full_name = ?, avatar_name = ? WHERE id = ?', [
      fullName,
      avatarName,
      id,
    ]);
  },

  async updateRole(id, role, conn) {
    await executor(conn).execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  },

  async updatePassword(id, passwordHash, conn) {
    await executor(conn).execute('UPDATE users SET password_hash = ? WHERE id = ?', [
      passwordHash,
      id,
    ]);
  },
};
