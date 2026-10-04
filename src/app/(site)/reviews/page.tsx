import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { SectionPill } from "@/components/SectionPill";
import type { PublicReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What people are saying about LINKY, the plain English link safety scanner.",
};

async function getApprovedReviews(): Promise<PublicReview[]> {
  const reviews = await prisma.review.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return reviews.map((r) => ({
    id: r.id,
    name: r.name,
    avatarSeed: r.avatarSeed,
    rating: r.rating,
    reviewText: r.reviewText,
    reason: r.reason,
    isDemo: r.isDemo,
    createdAt: r.createdAt.toISOString(),
  }));
}

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <div className="flex flex-col gap-space-lg px-margin-mobile pb-space-lg pt-space-md">
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-display text-headline-md tracking-tight text-black">LINKY review wall</h1>
        <p className="text-body-sm leading-relaxed text-ink-muted">
          What people say after checking a link with LINKY.
        </p>
      </div>

      <div className="flex flex-col gap-space-sm">
        <SectionPill>Reviews</SectionPill>
        {reviews.length === 0 ? (
          <p className="text-body-sm text-ink-muted">No reviews have been published yet.</p>
        ) : (
          <div
            className="flex flex-col gap-3 rounded-2xl bg-surface p-4"
            style={{ boxShadow: "3px 3px 0px #1c1b1b" }}
          >
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-space-sm">
        <SectionPill>Leave a review</SectionPill>
        <ReviewForm />
      </div>
    </div>
  );
}
