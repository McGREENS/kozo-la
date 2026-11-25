import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/lib/auth";

async function verifyAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  const decoded = await verifyToken(token);
  return decoded !== null;
}

export async function GET(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await db.execute({
      sql: `SELECT * FROM la_newsletter ORDER BY rowid DESC LIMIT 1000`,
    });

    const subscribers = result.rows.map((row) => ({
      id: row[0],
      name: row[1],
      email: row[2],
    }));

    return NextResponse.json({ subscribers });
  } catch (err: unknown) {
    console.error("[admin/subscribers] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAuth(req))) {
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

    await db.execute({
      sql: `DELETE FROM la_newsletter WHERE email = ?`,
      args: [email],
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[admin/subscribers] Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
