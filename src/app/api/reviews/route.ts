import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";
import { reviewSubmitSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      name: r.name,
      avatarUrl: r.avatarUrl,
      rating: r.rating,
      reviewText: r.reviewText,
      reason: r.reason,
      isDemo: r.isDemo,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request.headers);
  const rateLimit = checkRateLimit(`review:${clientKey}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "You've submitted too many reviews recently. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = reviewSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your review. Name and review text are required." },
      { status: 400 },
    );
  }

  const review = await prisma.review.create({
    data: {
      name: parsed.data.name,
      avatarUrl: parsed.data.avatarUrl || null,
      rating: parsed.data.rating,
      reviewText: parsed.data.reviewText,
      reason: parsed.data.reason || null,
      status: "pending",
    },
  });

  return NextResponse.json({ id: review.id }, { status: 201 });
}
