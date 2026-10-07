import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";

export const DEMO_USER = { username: "demo", password: "reading123" };

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "demo-secret-for-the-technical-exam-only-0123456789"
);

export async function createSession(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifySession(token: string) {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}