import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { getDb } from "@/app/lib/db";

const JWT_SECRET: string = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not configured in environment variables");
}

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare plain password with hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(user: AdminUser, expiresIn: string = "24h"): string {
  const payload: Omit<JWTPayload, "iat" | "exp"> = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"]
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Get user by email from database
 */
export async function getUserByEmail(email: string): Promise<AdminUser | null> {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id, email, name, role, is_active, created_at, updated_at FROM admin_users WHERE email = ? AND is_active = 1",
      args: [email],
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row[0] as number,
      email: row[1] as string,
      name: row[2] as string,
      role: row[3] as string,
      is_active: row[4] as number,
      created_at: row[5] as string,
      updated_at: row[6] as string,
    };
  } catch (err) {
    console.error("[auth] Error getting user:", err);
    return null;
  }
}

/**
 * Get user password hash from database
 */
export async function getUserPasswordHash(email: string): Promise<string | null> {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT password_hash FROM admin_users WHERE email = ? AND is_active = 1",
      args: [email],
    });

    if (result.rows.length === 0) return null;
    return result.rows[0][0] as string;
  } catch (err) {
    console.error("[auth] Error getting password hash:", err);
    return null;
  }
}

/**
 * Verify admin credentials against database
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  try {
    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return null;
    }

    // Get password hash
    const passwordHash = await getUserPasswordHash(email);
    if (!passwordHash) {
      return null;
    }

    // Verify password
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("[auth] Verification error:", err);
    return null;
  }
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers(): Promise<Omit<AdminUser, "password_hash">[]> {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT id, email, name, role, is_active, created_at, updated_at FROM admin_users ORDER BY created_at DESC",
    });

    return result.rows.map((row) => ({
      id: row[0] as number,
      email: row[1] as string,
      name: row[2] as string,
      role: row[3] as string,
      is_active: row[4] as number,
      created_at: row[5] as string,
      updated_at: row[6] as string,
    }));
  } catch (err) {
    console.error("[auth] Error getting all users:", err);
    return [];
  }
}

/**
 * Create new admin user
 */
export async function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: string = "admin"
): Promise<boolean> {
  try {
    const db = getDb();
    const passwordHash = await hashPassword(password);

    await db.execute({
      sql: `
        INSERT INTO admin_users (email, password_hash, name, role, is_active)
        VALUES (?, ?, ?, ?, 1)
      `,
      args: [email, passwordHash, name, role],
    });

    return true;
  } catch (err) {
    console.error("[auth] Error creating user:", err);
    return false;
  }
}

/**
 * Delete admin user
 */
export async function deleteAdminUser(userId: number): Promise<boolean> {
  try {
    const db = getDb();

    await db.execute({
      sql: "DELETE FROM admin_users WHERE id = ?",
      args: [userId],
    });

    return true;
  } catch (err) {
    console.error("[auth] Error deleting user:", err);
    return false;
  }
}

/**
 * Update admin user password
 */
export async function updateAdminUserPassword(
  userId: number,
  newPassword: string
): Promise<boolean> {
  try {
    const db = getDb();
    const passwordHash = await hashPassword(newPassword);

    await db.execute({
      sql: "UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [passwordHash, userId],
    });

    return true;
  } catch (err) {
    console.error("[auth] Error updating password:", err);
    return false;
  }
}

/**
 * Update admin user profile (name, email)
 */
export async function updateAdminUserProfile(
  userId: number,
  name: string,
  email: string
): Promise<boolean> {
  try {
    const db = getDb();

    await db.execute({
      sql: "UPDATE admin_users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [name, email, userId],
    });

    return true;
  } catch (err) {
    console.error("[auth] Error updating profile:", err);
    return false;
  }
}

/**
 * Get admin users visible to current user (respects role hierarchy)
 */
export async function getVisibleAdminUsers(currentUserRole: string): Promise<Omit<AdminUser, "password_hash">[]> {
  try {
    const db = getDb();
    let sql = "SELECT id, email, name, role, is_active, created_at, updated_at FROM admin_users";

    // Non-super-admins cannot see super-admins
    if (currentUserRole !== "super_admin") {
      sql += " WHERE role != 'super_admin'";
    }

    sql += " ORDER BY created_at DESC";

    const result = await db.execute({ sql });

    return result.rows.map((row) => ({
      id: row[0] as number,
      email: row[1] as string,
      name: row[2] as string,
      role: row[3] as string,
      is_active: row[4] as number,
      created_at: row[5] as string,
      updated_at: row[6] as string,
    }));
  } catch (err) {
    console.error("[auth] Error getting visible users:", err);
    return [];
  }
}
