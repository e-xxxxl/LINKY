import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionId } from "@/lib/session";

export async function GET() {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ scans: [] });
  }

  const scans = await prisma.scan.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    take: 100,
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
