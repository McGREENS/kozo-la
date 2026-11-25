import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();

  // ── Validation ──────────────────────────────────────────────
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // ── Persist ──────────────────────────────────────────────────
  try {
    await db.execute({
      sql: "INSERT INTO la_newsletter (name, email) VALUES (?, ?)",
      args: [name, email],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";

    // Duplicate email — SQLite UNIQUE constraint
    if (message.includes("UNIQUE") || message.includes("SQLITE_CONSTRAINT")) {
      return NextResponse.json(
        { error: "You're already on the list — we'll be in touch!" },
        { status: 409 }
      );
    }

    console.error("[la-newsletter] DB error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
