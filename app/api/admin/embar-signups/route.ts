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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.execute({
      sql: "SELECT id, email, subscribed_at, created_at FROM embar_signups ORDER BY subscribed_at DESC",
    });

    const signups = result.rows.map((row) => ({
      id: row[0] as number,
      email: row[1] as string,
      subscribed_at: row[2] as string,
      created_at: row[3] as string,
    }));

    return NextResponse.json({ signups });
  } catch (err: unknown) {
    console.error("[admin/embar-signups] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch signups" },
      { status: 500 }
    );
  }
}
