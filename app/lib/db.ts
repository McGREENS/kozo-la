import { createClient } from "@libsql/client";

/**
 * getDb()
 *
 * Lazily creates a libSQL / Turso client on first call at runtime.
 * A factory function (rather than a module-level singleton) ensures
 * the client is never instantiated during `next build` static analysis —
 * so the build succeeds even in CI environments without live env vars.
 *
 * Required env vars (set in .env.local):
 *   TURSO_DATABASE_URL   — e.g. libsql://your-db-name.aws-us-east-1.turso.io
 *   TURSO_AUTH_TOKEN     — auth token from the Turso dashboard
 */
export function getDb() {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("Missing environment variable: TURSO_DATABASE_URL");
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}
