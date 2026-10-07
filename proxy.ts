import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const loggedIn = token ? await verifySession(token) : false;
  const { pathname } = request.nextUrl;

  if (!loggedIn && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (loggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/search", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};