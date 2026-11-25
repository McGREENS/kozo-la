import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const file = formData.get("file") as File | null;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    let filename = "";
    let filedata = "";

    if (file && file.size > 0) {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Only PDF files are accepted" },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size must be less than 5MB" },
          { status: 400 }
        );
      }

      filename = file.name;
      const buffer = await file.arrayBuffer();
      filedata = Buffer.from(buffer).toString("base64");
    }

    await db.execute({
      sql: "INSERT INTO applications (name, email, message, filename, filedata) VALUES (?, ?, ?, ?, ?)",
      args: [name.trim(), email.trim(), message.trim(), filename, filedata],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Career application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
