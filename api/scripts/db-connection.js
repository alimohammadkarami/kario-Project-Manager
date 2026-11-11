import 'dotenv/config';
import mysql from 'mysql2/promise';

export function getDbName() {
  const name = process.env.DB_NAME;
  if (!name || !/^[\w$]+$/.test(name)) {
    console.error('DB_NAME is missing or contains invalid characters.');
    process.exit(1);
  }
  return name;
}

/** Connection that allows several statements per query (needed to run .sql files). */
export function openConnection({ withDatabase = true } = {}) {
  return mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: withDatabase ? getDbName() : undefined,
    multipleStatements: true,
  });
}
