-- Adds projects, project_members and tasks to an EXISTING database.
-- Safe to run more than once. Run with: npm run db:migrate

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
