import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !authToken) {
  console.error(
    "Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local"
  );
  process.exit(1);
}

const db = createClient({
  url: dbUrl,
  authToken,
});

async function setupAdminUsers() {
  try {
    console.log("🔧 Setting up admin_users table...\n");

    // Create table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Table created successfully!\n");

    // Check if admin already exists
    const existing = await db.execute({
      sql: "SELECT email FROM admin_users WHERE email = ?",
      args: ["admin@kozousa.com"],
    });

    if (existing.rows.length > 0) {
      console.log("⚠️  Admin user already exists. Skipping seed.\n");
      console.log("📝 To reset, delete the admin user from the database first.");
      process.exit(0);
    }

    // Create default super_admin user (protected user that cannot be deleted)
    const defaultPassword = "Admin@Kozo2026";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    await db.execute({
      sql: `
        INSERT INTO admin_users (email, password_hash, name, role, is_active)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: ["laurierhab@gmail.com", passwordHash, "Laurier HABIYAREMYE", "super_admin", 1],
    });

    console.log("✅ Seeded default super_admin user!\n");
    console.log("📋 Admin Credentials:");
    console.log("   Email:    laurierhab@gmail.com");
    console.log("   Password: Admin@Kozo2026");
    console.log("   Role:     super_admin (protected - cannot be deleted)\n");
    console.log("⚠️  ⚠️  IMPORTANT: Change this password after first login!\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

setupAdminUsers();
