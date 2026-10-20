-- Auth step: users + verification_codes.
-- All DATETIME values are stored in UTC.

CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_name   VARCHAR(10)  NULL,
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
