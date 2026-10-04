import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";
import { reviewSubmitSchema } from "@/lib/validation";
import { anonymousName } from "@/lib/avatar";

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
      avatarSeed: r.avatarSeed,
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
      { error: "Add a name (or stay anonymous) and write your review." },
      { status: 400 },
    );
  }

  const { anonymous, avatarSeed, name } = parsed.data;

  const review = await prisma.review.create({
    data: {
      name: anonymous ? anonymousName(avatarSeed) : (name as string),
      avatarSeed,
      rating: parsed.data.rating,
      reviewText: parsed.data.reviewText,
      reason: parsed.data.reason || null,
      // Reviews publish immediately; an admin can still reject one afterwards.
      status: "approved",
    },
  });

  return NextResponse.json({ id: review.id }, { status: 201 });
}
