import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function migrate() {
  try {
    console.log("Creating embar_signups table...");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS embar_signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        subscribed_at TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    console.log("✓ embar_signups table created successfully");

    // Create index on email for faster lookups
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_embar_signups_email ON embar_signups(email)
    `);

    console.log("✓ Index created on email column");

    console.log("\n✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
