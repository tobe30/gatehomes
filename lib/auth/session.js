import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "gatehomes_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user._id.toString(),
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    }),
  ).toString("base64url");

  const signature = createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  try {
    if (typeof token !== "string") return null;

    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra !== undefined) return null;

    const expectedSignature = createHmac("sha256", getAuthSecret())
      .update(payload)
      .digest();
    const suppliedSignature = Buffer.from(signature, "base64url");

    if (
      suppliedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(suppliedSignature, expectedSignature)
    ) {
      return null;
    }

    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      typeof session.sub !== "string" ||
      !["admin", "customer"].includes(session.role) ||
      !Number.isInteger(session.exp) ||
      session.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/** @returns {{ httpOnly: boolean, secure: boolean, sameSite: "lax", path: string, maxAge: number }} */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
