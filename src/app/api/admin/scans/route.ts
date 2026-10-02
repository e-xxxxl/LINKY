import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const scans = await prisma.scan.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      normalizedUrl: true,
      host: true,
      riskLevel: true,
      riskScore: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    scans: scans.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() })),
  });
}
