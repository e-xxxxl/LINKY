import type { PublicReview } from "@/lib/reviews";
import { Icon } from "./Icon";

export function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl bg-surface-lowest p-4"
      style={{ boxShadow: "2px 2px 0px #1c1b1b" }}
    >
      <div className="flex items-center text-black">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="star" size={18} fill={i < review.rating} className={i < review.rating ? "" : "text-line"} />
        ))}
      </div>
      <p className="text-body-sm italic leading-snug text-ink">&ldquo;{review.reviewText}&rdquo;</p>
      <span className="font-display text-label-sm not-italic uppercase tracking-wide text-ink-muted">
        — {review.name}
        {review.reason ? `, ${review.reason}` : ""}
        {review.isDemo ? " (demo)" : ""}
      </span>
    </div>
  );
}
