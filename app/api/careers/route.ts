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

  // Read PDF bytes if provided
  let cvData: Uint8Array | null = null;
  let cvName = "";
  if (cvFile && cvFile.size > 0) {
    const buffer = await cvFile.arrayBuffer();
    cvData = new Uint8Array(buffer);
    cvName = cvFile.name;
  }

  // ── Persist ──────────────────────────────────────────────────
  try {
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO la_careers (name, email, message, cv_name, cv_data)
            VALUES (?, ?, ?, ?, ?)`,
      args: [name, email, message, cvName, cvData],
    });
  } catch (err) {
    console.error("[careers] DB error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
