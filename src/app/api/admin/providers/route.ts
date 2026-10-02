import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { providerConfigStatus } from "@/lib/reputation";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({ providers: providerConfigStatus() });
}
