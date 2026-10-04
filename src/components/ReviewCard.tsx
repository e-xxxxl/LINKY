import type { PublicReview } from "@/lib/reviews";
import { Icon } from "./Icon";
import { BubbleAvatar } from "./BubbleAvatar";

export function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl bg-surface-lowest p-4"
      style={{ boxShadow: "2px 2px 0px #1c1b1b" }}
    >
      <div className="flex items-center text-black">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="star" size={18} fill={i < review.rating} className={i < review.rating ? "" : "text-line"} />
        ))}
      </div>
      <p className="text-body-sm italic leading-snug text-ink">&ldquo;{review.reviewText}&rdquo;</p>
      <div className="flex items-center gap-3">
        <BubbleAvatar seed={review.avatarSeed ?? review.id} size={36} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-display text-label-md text-ink">
            {review.name}
            {review.isDemo ? " (demo)" : ""}
          </span>
          {review.reason && <span className="truncate text-label-sm text-ink-faint">{review.reason}</span>}
        </div>
      </div>
    </div>
  );
}
