/**
 * migrate-la-careers.mjs
 * Creates the la_careers table in the KŌZO LA Turso database.
 * Run: node --env-file=.env.local scripts/migrate-la-careers.mjs
 */
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS la_careers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL DEFAULT '',
    cv_name    TEXT NOT NULL DEFAULT '',
    cv_data    BLOB,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

console.log("✓  la_careers table is ready.");
process.exit(0);
