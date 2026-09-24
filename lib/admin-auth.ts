import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/*
 * Simple single-password admin gate: no user accounts, just a shared password
 * (ADMIN_PASSWORD in .env.local) and a signed cookie proving someone typed it.
 * That matches a single-owner shop; it is not meant for multiple staff accounts.
 */

const COOKIE = "webor_admin";

function token() {
  const secret = process.env.COOKIE_SECRET;
  if (!secret || !process.env.ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_PASSWORD and COOKIE_SECRET in .env.local before using the admin panel.");
  }
  return crypto.createHmac("sha256", secret).update("webor-admin:v1").digest("hex");
}

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function passwordMatches(password: string) {
  return safeEqual(password, process.env.ADMIN_PASSWORD ?? "") && !!process.env.ADMIN_PASSWORD;
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  return !!value && safeEqual(value, token());
}

/** Call at the top of every admin page and action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function signIn() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}
