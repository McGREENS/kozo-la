import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { verifyToken } from "@/app/lib/auth";

function verifyAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded !== null;
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT * FROM la_careers ORDER BY rowid DESC LIMIT 1000`,
    });

    const applications = result.rows.map((row) => ({
      id: row[0],
      name: row[1],
      email: row[2],
      role: row[3],
      message: row[4],
    }));

    return NextResponse.json({ applications });
  } catch (err: unknown) {
    console.error("[admin/careers] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const email = body.email ?? "";

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute({
      sql: `DELETE FROM la_careers WHERE email = ?`,
      args: [email],
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[admin/careers] Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
