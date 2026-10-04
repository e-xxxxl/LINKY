import { ScannerForm } from "@/components/ScannerForm";
import { HowItWorks } from "@/components/HowItWorks";
import { SectionPill } from "@/components/SectionPill";
import { ReviewCard } from "@/components/ReviewCard";
import { CtaBlock } from "@/components/CtaBlock";
import { prisma } from "@/lib/db";
import type { PublicReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

async function getFeaturedReviews(): Promise<PublicReview[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 2,
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
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const reviews = await getFeaturedReviews();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-space-md px-margin-mobile pb-space-lg pt-space-md">
        <div className="flex flex-col gap-space-xs">
          <SectionPill large>Zero-risk checking</SectionPill>
          <h1 className="font-display text-headline-xl-mobile leading-tight tracking-tight text-black">
            Check any link before you click
          </h1>
          <p className="text-body-sm leading-relaxed text-ink-muted">
            Instant link safety verdicts so you never get tricked by phishing or malicious downloads.
          </p>
        </div>
        <ScannerForm />
      </div>

      <HowItWorks />

      <div className="flex flex-col gap-space-sm px-margin-mobile pb-space-lg">
        <SectionPill>Reviews</SectionPill>
        {reviews.length > 0 ? (
          <div
            className="flex flex-col gap-3 rounded-2xl bg-surface p-4"
            style={{ boxShadow: "3px 3px 0px #1c1b1b" }}
          >
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-body-sm text-ink-muted">No reviews have been published yet.</p>
        )}
      </div>

      <CtaBlock />
    </div>
  );
}
