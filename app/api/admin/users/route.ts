import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import { getAllAdminUsers, createAdminUser, deleteAdminUser } from "@/app/lib/auth";

function verifyAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET all users
export async function GET(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const users = await getAllAdminUsers();
    return NextResponse.json({ users });
  } catch (err: unknown) {
    console.error("[admin/users] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST create new user
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
  } catch (err: unknown) {
    console.error("[admin/users] Create error:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// DELETE remove user
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
