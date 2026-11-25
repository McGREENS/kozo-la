import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await db.execute({
    sql: "SELECT filename, filedata FROM applications WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = result.rows[0];
  const filedata = row.filedata as string;
  const filename = row.filename as string;

  if (!filedata) {
    return NextResponse.json({ error: "No resume attached" }, { status: 404 });
  }

  const buffer = Buffer.from(filedata, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
