import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      name: r.name,
      avatarUrl: r.avatarUrl,
      rating: r.rating,
      reviewText: r.reviewText,
      reason: r.reason,
      status: r.status,
      isDemo: r.isDemo,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}
