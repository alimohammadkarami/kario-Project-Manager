-- Upgrades an EXISTING database: adds users.role and the tickets table.
-- Safe to run more than once. Run with: npm run db:migrate
-- Existing users become 'subscriber'.
-- Make yourself admin afterwards (manual by design, there is no route for it):
--   UPDATE users SET role = 'admin' WHERE email = 'you@example.com';

SET @role_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
);
SET @add_role := IF(
  @role_exists = 0,
  "ALTER TABLE users ADD COLUMN role ENUM('subscriber','admin','support') NOT NULL DEFAULT 'subscriber' AFTER avatar_name",
  'SELECT 1'
);
PREPARE stmt FROM @add_role;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS tickets (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tracking_code VARCHAR(20)     NULL,
  user_id       CHAR(36)        NOT NULL,
  title         VARCHAR(150)    NOT NULL,
  description   TEXT            NOT NULL,
  status        ENUM('pending','answered') NOT NULL DEFAULT 'pending',
  answer        TEXT            NULL,
  answered_by   CHAR(36)        NULL,
  answered_at   DATETIME        NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tickets_tracking_code (tracking_code),
  KEY idx_tickets_user_created (user_id, created_at),
  KEY idx_tickets_status_created (status, created_at),
  CONSTRAINT fk_tickets_user        FOREIGN KEY (user_id)     REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_tickets_answered_by FOREIGN KEY (answered_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
