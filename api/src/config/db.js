import mysql from 'mysql2/promise';
import { config } from './env.js';

export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  connectionLimit: config.db.poolLimit,
  waitForConnections: true,
  charset: 'utf8mb4',
  timezone: 'Z', // JS Date <-> DATETIME is always UTC
});

// Every connection works in UTC so CURRENT_TIMESTAMP defaults match JS dates.
pool.on('connection', (connection) => {
  connection.query("SET time_zone = '+00:00'");
});

/**
 * Runs `callback(conn)` inside a transaction.
 * Commits on success, rolls back on any thrown error.
 */
export async function withTransaction(callback) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
