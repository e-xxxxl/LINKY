import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toScanReport } from "@/lib/scanMapper";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scan = await prisma.scan.findUnique({ where: { id } });

  if (!scan) {
    return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  }

  return NextResponse.json(toScanReport(scan));
}
