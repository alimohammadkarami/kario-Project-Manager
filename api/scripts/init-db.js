import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getDbName, openConnection } from './db-connection.js';

const schemaPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../database/schema.sql'
);

const dbName = getDbName();
const connection = await openConnection({ withDatabase: false });

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
