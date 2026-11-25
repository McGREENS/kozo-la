import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

console.log("🚀 Setting up Kōzo Los Angeles database...\n");

try {
  // Create all tables one by one
  console.log("Creating admins table...");
  await db.execute(`CREATE TABLE IF NOT EXISTS admins (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    name       TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  
  console.log("Creating contacts table...");
  await db.execute(`CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT DEFAULT '',
    message    TEXT NOT NULL,
    status     TEXT DEFAULT 'unread',
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  
  console.log("Creating menus table...");
  await db.execute(`CREATE TABLE IF NOT EXISTS menus (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    category   TEXT UNIQUE NOT NULL,
    filename   TEXT NOT NULL,
    filedata   TEXT DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  
  console.log("Creating applications table...");
  await db.execute(`CREATE TABLE IF NOT EXISTS applications (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    filename   TEXT DEFAULT '',
    filedata   TEXT DEFAULT '',
    status     TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  console.log("✅ All tables created successfully\n");

  // Create default admin user
  const hash = await bcrypt.hash("kozo@admin2025", 12);
  
  await db.execute({
    sql: `INSERT OR IGNORE INTO admins (email, password, name) VALUES (?, ?, ?)`,
    args: ["admin@kozousa.com", hash, "Kōzo Admin"],
  });

  console.log("✅ Default admin user created");
  console.log("   Email: admin@kozousa.com");
  console.log("   Password: kozo@admin2025\n");

  // Verify tables
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("📋 Database tables:");
  tables.rows.forEach((r) => console.log(`   • ${r.name}`));

  // Show table structures
  console.log("\n📊 Table Structures:\n");
  
  for (const table of tables.rows) {
    const tableName = table.name;
    const info = await db.execute(`PRAGMA table_info(${tableName})`);
    console.log(`${tableName}:`);
    info.rows.forEach((col) => {
      console.log(`   ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
    });
    console.log("");
  }

  console.log("✅ Database setup complete!");
  process.exit(0);
} catch (error) {
  console.error("❌ Error setting up database:", error);
  process.exit(1);
}
