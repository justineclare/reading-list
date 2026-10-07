import { NextResponse } from "next/server";
import { DEMO_USER, SESSION_COOKIE, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = await createSession(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}