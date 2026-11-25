import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["pending", "contacted", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await db.execute({
      sql: "UPDATE private_event_inquiries SET status = ? WHERE id = ?",
      args: [status, parseInt(id)],
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[admin/private-events/update] Error:", err);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await db.execute({
      sql: "DELETE FROM private_event_inquiries WHERE id = ?",
      args: [parseInt(id)],
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[admin/private-events/delete] Error:", err);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
