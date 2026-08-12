import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, generateToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const password = (body.password ?? "").trim();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify credentials
    const user = await verifyAdminCredentials(email, password);

    if (!user) {
      // Don't reveal whether email or password is wrong (security best practice)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token (expires in 24 hours)
    const token = generateToken(user, "24h");

    // Return token as httpOnly cookie + response
    const response = NextResponse.json({
      ok: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("[admin/auth] Error:", err);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
