import app from './app.js';
import { pool } from './config/db.js';
import { config } from './config/env.js';

async function start() {
  await pool.query('SELECT 1'); // fail fast if the database is unreachable

  const server = app.listen(config.port, () => {
    console.log(`API listening on port ${config.port} (${config.env})`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => console.error('[unhandledRejection]', reason));

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
