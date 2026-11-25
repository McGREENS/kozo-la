import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, guests, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Insert inquiry into database
    await db.execute({
      sql: `INSERT INTO private_event_inquiries 
            (name, email, phone, event_date, guests, message, submitted_at) 
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [name, email, phone || null, date || null, guests || null, message || null],
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[private-events] Error:", err);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
