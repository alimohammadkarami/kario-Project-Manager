-- Full schema for a FRESH install (npm run db:init).
-- Existing database? run: npm run db:migrate
-- All DATETIME values are stored in UTC.

CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_name   VARCHAR(10)  NULL,
  -- subscriber: default for public register
  -- support:    assigned by an admin through POST /api/v1/users/support-staff
  -- admin:      assigned MANUALLY in the database (no route):
  --             UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
  role          ENUM('subscriber','admin','support') NOT NULL DEFAULT 'subscriber',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row = one verification flow:
--   1) code sent      (code_hash, expires_at)
--   2) code verified  (verified_at, reset_token_hash, reset_token_expires_at)
--   3) token consumed (used_at)
CREATE TABLE IF NOT EXISTS verification_codes (
  id                      CHAR(36)             NOT NULL,
  email                   VARCHAR(255)         NOT NULL,
  purpose                 ENUM('password_reset') NOT NULL,
  code_hash               CHAR(64)             NOT NULL,
  attempts                TINYINT UNSIGNED     NOT NULL DEFAULT 0,
  expires_at              DATETIME             NOT NULL,
  verified_at             DATETIME             NULL,
  reset_token_hash        CHAR(64)             NULL,
  reset_token_expires_at  DATETIME             NULL,
  used_at                 DATETIME             NULL,
  created_at              DATETIME             NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_vc_email_purpose_created (email, purpose, created_at),
  UNIQUE KEY uq_vc_reset_token_hash (reset_token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- A ticket holds exactly ONE answer: the answer columns live on the same row.
--   tracking_code = <Jalali date YYYYMMDD>-<row id padded to 4 digits>, e.g. 14050412-0027
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

-- ---------------------------------------------------------------------------
-- Projects & tasks
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS projects (
  id          CHAR(36)     NOT NULL,
  name        VARCHAR(150) NOT NULL,
  description TEXT         NULL,
  due_date    DATE         NULL,                 -- project deadline
  created_by  CHAR(36)     NULL,                 -- original creator; kept as NULL if that user is ever deleted
  is_archived TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_projects_created_by (created_by),
  CONSTRAINT fk_projects_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Junction table User <-> Project. The creator of a project is its 'owner' (project manager).
CREATE TABLE IF NOT EXISTS project_members (
  id         CHAR(36)    NOT NULL,
  project_id CHAR(36)    NOT NULL,
  user_id    CHAR(36)    NOT NULL,
  role       ENUM('owner','member')    NOT NULL DEFAULT 'member',
  status     ENUM('active','invited')  NOT NULL DEFAULT 'active',
  joined_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_project_members_project_user (project_id, user_id),
  KEY idx_project_members_user (user_id),
  CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_user    FOREIGN KEY (user_id)    REFERENCES users (id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tasks (
  id                CHAR(36)     NOT NULL,
  project_id        CHAR(36)     NOT NULL,
  title             VARCHAR(150) NOT NULL,
  description       TEXT         NULL,
  assignee_id       CHAR(36)     NULL,           -- NULL = unassigned (status can't be changed until assigned)
  status            ENUM('todo','in_progress','done') NOT NULL DEFAULT 'todo',
  due_date          DATE         NULL,
  created_by        CHAR(36)     NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_changed_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_project_status (project_id, status),
  KEY idx_tasks_assignee_status (assignee_id, status),
  KEY idx_tasks_due_date (due_date),
  CONSTRAINT fk_tasks_project    FOREIGN KEY (project_id)  REFERENCES projects (id) ON DELETE CASCADE,
  -- business rule 1: deleting a user un-assigns their tasks, it never deletes them
  CONSTRAINT fk_tasks_assignee   FOREIGN KEY (assignee_id) REFERENCES users (id)    ON DELETE SET NULL,
  CONSTRAINT fk_tasks_created_by FOREIGN KEY (created_by)  REFERENCES users (id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
