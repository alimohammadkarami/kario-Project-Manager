import { pool } from '../config/db.js';

const executor = (conn) => conn ?? pool;

export const VerificationCodeModel = {
  async create({ id, email, purpose, codeHash, expiresAt }, conn) {
    await executor(conn).execute(
      `INSERT INTO verification_codes (id, email, purpose, code_hash, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, email, purpose, codeHash, expiresAt]
    );
  },

  async findLatest(email, purpose, conn) {
    const [rows] = await executor(conn).execute(
      `SELECT * FROM verification_codes
       WHERE email = ? AND purpose = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1`,
      [email, purpose]
    );
    return rows[0] ?? null;
  },

  async findByResetTokenHash(resetTokenHash, conn) {
    const [rows] = await executor(conn).execute(
      'SELECT * FROM verification_codes WHERE reset_token_hash = ? LIMIT 1',
      [resetTokenHash]
    );
    return rows[0] ?? null;
  },

  async incrementAttempts(id, conn) {
    await executor(conn).execute(
      'UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?',
      [id]
    );
  },

  async markVerified(id, { resetTokenHash, resetTokenExpiresAt }, conn) {
    await executor(conn).execute(
      `UPDATE verification_codes
       SET verified_at = ?, reset_token_hash = ?, reset_token_expires_at = ?
       WHERE id = ?`,
      [new Date(), resetTokenHash, resetTokenExpiresAt, id]
    );
  },

  /** Returns true only for the request that actually consumed the row. */
  async markUsed(id, conn) {
    const [result] = await executor(conn).execute(
      'UPDATE verification_codes SET used_at = ? WHERE id = ? AND used_at IS NULL',
      [new Date(), id]
    );
    return result.affectedRows === 1;
  },

  /** Closes every still-open flow of this email, so only one is active at a time. */
  async invalidateOpen(email, purpose, conn) {
    await executor(conn).execute(
      `UPDATE verification_codes SET used_at = ?
       WHERE email = ? AND purpose = ? AND used_at IS NULL`,
      [new Date(), email, purpose]
    );
  },
};
