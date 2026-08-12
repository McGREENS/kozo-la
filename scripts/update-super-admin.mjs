/**
 * update-super-admin.mjs
 * Updates laurierhab@gmail.com to super_admin role.
 * Run: node --env-file=.env.local scripts/update-super-admin.mjs
 */
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  console.log("🔧 Updating laurierhab@gmail.com to super_admin...\n");

  const result = await db.execute({
    sql: `UPDATE admin_users SET role = 'super_admin' WHERE email = ?`,
    args: ["laurierhab@gmail.com"],
  });

  console.log("✅ User updated successfully!");
  console.log("📝 Email: laurierhab@gmail.com");
  console.log("📝 Role: super_admin\n");

  process.exit(0);
} catch (err) {
  console.error("❌ Error:", err);
  process.exit(1);
}
