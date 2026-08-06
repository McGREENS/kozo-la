import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name    = (body.name    ?? "").trim();
  const email   = (body.email   ?? "").trim();
  const role    = (body.role    ?? "").trim();
  const message = (body.message ?? "").trim();

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
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO la_careers (name, email, role, message) VALUES (?, ?, ?, ?)`,
      args: [name, email, role || null, message || null],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";

    if (message.includes("UNIQUE") || message.includes("SQLITE_CONSTRAINT")) {
      return NextResponse.json(
        { error: "We already have your details — we'll be in touch!" },
        { status: 409 }
      );
    }

    console.error("[la-careers] DB error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
