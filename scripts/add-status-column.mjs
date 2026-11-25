import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function migrate() {
  try {
    console.log("Adding status column to private_event_inquiries table...");

    await db.execute(`
      ALTER TABLE private_event_inquiries 
      ADD COLUMN status TEXT DEFAULT 'pending'
    `);

    console.log("✓ status column added successfully");

    console.log("\n✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    console.error("If the column already exists, you can ignore this error.");
    process.exit(1);
  }
}

migrate();
