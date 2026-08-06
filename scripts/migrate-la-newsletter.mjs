/**
 * migrate-la-newsletter.mjs
 *
 * Creates the `la_newsletter` table in the KŌZO LA Turso database.
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-la-newsletter.mjs
 */

import { createClient } from "@libsql/client";

if (!process.env.TURSO_DATABASE_URL) {
  console.error("ERROR: TURSO_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS la_newsletter (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

console.log("✓  la_newsletter table is ready.");
process.exit(0);
