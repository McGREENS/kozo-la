import { NextRequest, NextResponse } from "next/server";
import { verifyToken, updateAdminUserPassword, updateAdminUserProfile } from "@/app/lib/auth";
import { getAllAdminUsers, createAdminUser, deleteAdminUser, getVisibleAdminUsers } from "@/app/lib/auth";

function verifyAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET all users visible to current user
export async function GET(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Only super_admin sees all users; others see only non-super-admin users
    const users = await getVisibleAdminUsers(user.role);
    return NextResponse.json({ users });
  } catch (err: unknown) {
    console.error("[admin/users] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - can create new user OR update own profile/password
export async function POST(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const action = body.action || "create";

    // ─── UPDATE OWN PROFILE ──────────────────────────────────────
    if (action === "update_profile") {
      const newName = (body.name ?? "").trim();
      const newEmail = (body.email ?? "").trim().toLowerCase();

      if (!newName || !newEmail) {
        return NextResponse.json(
          { error: "Name and email are required" },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      const success = await updateAdminUserProfile(user.userId, newName, newEmail);

      if (!success) {
        return NextResponse.json(
          { error: "Failed to update profile" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: "Profile updated successfully",
      });
    }

    // ─── UPDATE OWN PASSWORD ────────────────────────────────────
    if (action === "update_password") {
      const newPassword = (body.password ?? "").trim();

      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      const success = await updateAdminUserPassword(user.userId, newPassword);

      if (!success) {
        return NextResponse.json(
          { error: "Failed to update password" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: "Password updated successfully",
      });
    }

    // ─── CREATE NEW USER (only super_admin can create other users) ──
    if (action === "create") {
      if (user.role !== "super_admin") {
        return NextResponse.json(
          { error: "Only super admins can create users" },
          { status: 403 }
        );
      }

      const email = (body.email ?? "").trim().toLowerCase();
      const password = (body.password ?? "").trim();
      const name = (body.name ?? "").trim();
      const role = (body.role ?? "admin").trim();

      if (!email || !password || !name) {
        return NextResponse.json(
          { error: "Email, password, and name are required" },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      const success = await createAdminUser(email, password, name, role);

      if (!success) {
        return NextResponse.json(
          { error: "Failed to create user (email may already exist)" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: "User created successfully",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("[admin/users] Create error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// DELETE - remove user (with role-based restrictions)
export async function DELETE(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === user.userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Only super_admin can delete users
    if (user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can delete users" },
        { status: 403 }
      );
    }

    // Prevent deletion of super_admin users
    // First check the target user's role
    const db = await import("@/app/lib/db").then(m => m.getDb());
    const result = await db.execute({
      sql: "SELECT role FROM admin_users WHERE id = ?",
      args: [userId],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetUserRole = result.rows[0][0] as string;
    if (targetUserRole === "super_admin") {
      return NextResponse.json(
        { error: "Super admin users cannot be deleted" },
        { status: 403 }
      );
    }

    const success = await deleteAdminUser(userId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[admin/users] Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
