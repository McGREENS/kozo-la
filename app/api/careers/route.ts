import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

/**
 * POST /api/careers
 *
 * Accepts a multipart form submission (name, email, message, optional PDF CV).
 * Stores the application in the la_careers table.
 * Mirrors the pattern of the Kigali contact API route.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name    = ((formData.get("name")    as string) ?? "").trim();
    const email   = ((formData.get("email")   as string) ?? "").trim();
    const message = ((formData.get("message") as string) ?? "").trim();
    const cvFile  = formData.get("cv") as File | null;

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

    if (cvFile && cvFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "CV must be a PDF file." },
        { status: 400 }
      );
    }

    // ── Persist ──────────────────────────────────────────────────
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO la_careers (name, email, message) VALUES (?, ?, ?)`,
      args: [name, email, message],
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "";
    console.error("[careers] Error:", err);

    // Check for duplicate email
    if (errorMessage.includes("UNIQUE") || errorMessage.includes("SQLITE_CONSTRAINT")) {
      return NextResponse.json(
        { error: "We already have your application on file. Thank you!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
