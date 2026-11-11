import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { openConnection } from './db-connection.js';

const migrationsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../database/migrations'
);

const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();
const connection = await openConnection();

try {
  for (const file of files) {
    await connection.query(await readFile(path.join(migrationsDir, file), 'utf8'));
    console.log(`applied: ${file}`);
  }
  console.log('Migrations finished.');
} finally {
  await connection.end();
}
