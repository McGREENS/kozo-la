import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
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
