export const DATABASE_VERSION = 1;

export const CREATE_BLOOD_MARKERS = `
  CREATE TABLE IF NOT EXISTS blood_markers (
    id                TEXT PRIMARY KEY,
    name              TEXT NOT NULL,
    short_name        TEXT NOT NULL,
    category          TEXT NOT NULL,
    default_unit      TEXT NOT NULL,
    alt_unit          TEXT,
    conversion_factor REAL,
    reference_low     REAL NOT NULL,
    reference_high    REAL NOT NULL,
    description       TEXT NOT NULL DEFAULT '',
    is_custom         INTEGER NOT NULL DEFAULT 0
  );
`;

export const CREATE_TEST_SESSIONS = `
  CREATE TABLE IF NOT EXISTS test_sessions (
    id         TEXT PRIMARY KEY,
    date       TEXT NOT NULL,
    lab_name   TEXT,
    notes      TEXT,
    created_at TEXT NOT NULL
  );
`;

export const CREATE_TEST_RESULTS = `
  CREATE TABLE IF NOT EXISTS test_results (
    id         TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
    marker_id  TEXT NOT NULL REFERENCES blood_markers(id),
    value      REAL NOT NULL,
    unit       TEXT NOT NULL
  );
`;

export const CREATE_SETTINGS = `
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_results_session ON test_results(session_id);
  CREATE INDEX IF NOT EXISTS idx_results_marker  ON test_results(marker_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_date   ON test_sessions(date DESC);
`;
