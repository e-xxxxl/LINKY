import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const SESSION_COOKIE = "linky_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

// Anonymous scans are tied to a random session id stored in a cookie so a
// visitor can see their own scan history without creating an account or
// LINKY storing any personal information.
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return id;
}

export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
