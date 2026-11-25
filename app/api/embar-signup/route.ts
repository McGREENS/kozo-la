import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db.execute({
      sql: "SELECT email FROM embar_signups WHERE email = ?",
      args: [email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 }
      );
    }

    // Insert new signup
    await db.execute({
      sql: "INSERT INTO embar_signups (email, subscribed_at) VALUES (?, datetime('now'))",
      args: [email],
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[embar-signup] Error:", err);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
