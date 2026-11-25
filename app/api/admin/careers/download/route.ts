import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/lib/auth";

async function verifyAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  const decoded = await verifyToken(token);
  return decoded !== null;
}

/**
 * GET /api/admin/careers/download?email=...
 * Downloads the CV for an applicant
 */
export async function GET(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    let result;
    try {
      result = await db.execute({
        sql: `SELECT cv_filename, cv_data FROM la_careers WHERE email = ?`,
        args: [email],
      });
    } catch (err: unknown) {
      // If cv columns don't exist, return not found
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes("no such column") || errorMsg.includes("cv_filename")) {
        return NextResponse.json(
          { error: "No CV attached to this application" },
          { status: 404 }
        );
      }
      throw err;
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const cvFilename = row[0] as string | null;
    const cvData = row[1] as Uint8Array | null;

    if (!cvData) {
      return NextResponse.json(
        { error: "No CV attached to this application" },
        { status: 404 }
      );
    }

    return new NextResponse(Buffer.from(cvData), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cvFilename || 'cv.pdf'}"`,
      },
    });
  } catch (err: unknown) {
    console.error("[admin/careers/download] Error:", err);
    return NextResponse.json(
      { error: "Failed to download CV" },
      { status: 500 }
    );
  }
}
