/**
 * add-role-column.mjs
 * Adds role column to existing la_careers table.
 * Run: node --env-file=.env.local scripts/add-role-column.mjs
 */
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  console.log("🔧 Adding role column to la_careers table...\n");

  await db.execute(`
    ALTER TABLE la_careers ADD COLUMN role TEXT
  `).catch(() => {
    console.log("ℹ️  role column already exists");
  });

  console.log("\n✅ Role column added successfully!");
  console.log("📝 Existing applications will have NULL role.");
  console.log("🎉 New submissions will now store the applied role.\n");

  process.exit(0);
} catch (err) {
  console.error("❌ Error:", err);
  process.exit(1);
}
