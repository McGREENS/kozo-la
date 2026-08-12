/**
 * add-cv-columns.mjs
 * Adds cv_filename and cv_data columns to existing la_careers table.
 * Run: node --env-file=.env.local scripts/add-cv-columns.mjs
 */
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  console.log("🔧 Adding CV columns to la_careers table...\n");

  // Add cv_filename column if it doesn't exist
  await db.execute(`
    ALTER TABLE la_careers ADD COLUMN cv_filename TEXT
  `).catch(() => {
    console.log("ℹ️  cv_filename column already exists");
  });

  // Add cv_data column if it doesn't exist
  await db.execute(`
    ALTER TABLE la_careers ADD COLUMN cv_data BLOB
  `).catch(() => {
    console.log("ℹ️  cv_data column already exists");
  });

  console.log("\n✅ CV columns added successfully!");
  console.log("📝 Existing applications will have NULL cv_filename and cv_data.");
  console.log("🎉 New submissions will now store CV files.\n");

  process.exit(0);
} catch (err) {
  console.error("❌ Error:", err);
  process.exit(1);
}
