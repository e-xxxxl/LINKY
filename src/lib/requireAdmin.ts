import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "./adminAuth";

export async function requireAdmin(): Promise<NextResponse | null> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return null;
}
