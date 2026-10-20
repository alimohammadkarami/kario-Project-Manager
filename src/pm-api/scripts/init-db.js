import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';

const dbName = process.env.DB_NAME ?? 'project_management';
if (!/^[\w$]+$/.test(dbName)) {
  console.error('DB_NAME contains invalid characters.');
  process.exit(1);
}

const schemaPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../database/schema.sql'
);

const connection = await mysql.createConnection({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  multipleStatements: true,
});

try {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.changeUser({ database: dbName });
  await connection.query(await readFile(schemaPath, 'utf8'));
  console.log(`Database "${dbName}" is ready.`);
} finally {
  await connection.end();
}
