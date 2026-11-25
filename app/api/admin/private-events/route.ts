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
      sql: "SELECT id, name, email, phone, event_date, guests, message, submitted_at, status FROM private_event_inquiries ORDER BY submitted_at DESC",
    });

    const inquiries = result.rows.map((row) => ({
      id: row[0] as number,
      name: row[1] as string,
      email: row[2] as string,
      phone: row[3] as string | null,
      event_date: row[4] as string | null,
      guests: row[5] as number | null,
      message: row[6] as string | null,
      submitted_at: row[7] as string,
      status: row[8] as string | null,
    }));

    return NextResponse.json({ inquiries });
  } catch (err: unknown) {
    console.error("[admin/private-events] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
