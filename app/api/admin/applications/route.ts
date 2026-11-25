import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.execute(
    "SELECT id, name, email, message, filename, status, created_at FROM applications ORDER BY created_at DESC"
  );

  return NextResponse.json(result.rows);
}
