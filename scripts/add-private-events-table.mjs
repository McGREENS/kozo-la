import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function migrate() {
  try {
    console.log("Creating private_event_inquiries table...");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS private_event_inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        event_date TEXT,
        guests INTEGER,
        message TEXT,
        status TEXT DEFAULT 'pending',
        submitted_at TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    console.log("✓ private_event_inquiries table created successfully");

    // Create index on email for faster lookups
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_private_events_email ON private_event_inquiries(email)
    `);

    console.log("✓ Index created on email column");

    console.log("\n✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
