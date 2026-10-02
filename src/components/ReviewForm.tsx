"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          avatarUrl: avatarUrl || undefined,
          rating,
          reviewText,
          reason: reason || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data?.error ?? "We couldn't submit your review. Please try again.");
        return;
      }

      setStatus("success");
      setName("");
      setAvatarUrl("");
      setRating(5);
      setReviewText("");
      setReason("");
    } catch {
      setStatus("error");
      setError("We couldn't submit your review. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-surface-lowest p-space-md shadow-sm">
        <div className="flex items-center gap-2">
          <Icon name="check_circle" size={20} className="text-risk-safe" />
          <p className="text-label-md font-semibold text-ink">Thanks for sharing your experience.</p>
        </div>
        <p className="mt-1 text-body-sm text-ink-muted">
          Your review is pending moderation and will appear on the review wall once approved.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-3 text-label-md font-semibold text-black underline underline-offset-2">
          Submit another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-md rounded-xl bg-surface-lowest p-space-md shadow-sm">
      <div>
        <label htmlFor="review-name" className="mb-1.5 block text-label-md text-ink-muted">
          Name
        </label>
        <input
          id="review-name"
          required
          minLength={2}
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-lg border border-line bg-surface px-3.5 text-body-sm text-ink focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="review-avatar" className="mb-1.5 block text-label-md text-ink-muted">
          Avatar URL <span className="font-normal text-ink-faint">(optional)</span>
        </label>
        <input
          id="review-avatar"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="h-12 w-full rounded-lg border border-line bg-surface px-3.5 text-body-sm text-ink focus:border-black focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-label-md text-ink-muted">Rating</legend>
        <div className="flex gap-2" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              role="radio"
              aria-checked={rating === n}
              onClick={() => setRating(n)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-label-md font-semibold transition-colors ${
                rating === n ? "border-black bg-black text-white" : "border-line text-ink-muted hover:border-black"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-text" className="mb-1.5 block text-label-md text-ink-muted">
          Review
        </label>
        <textarea
          id="review-text"
          required
          minLength={10}
          maxLength={600}
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share what happened and how LINKY helped."
          className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-body-sm text-ink focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="review-reason" className="mb-1.5 block text-label-md text-ink-muted">
          Reason for using LINKY <span className="font-normal text-ink-faint">(optional)</span>
        </label>
        <input
          id="review-reason"
          maxLength={120}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Checking a delivery text"
          className="h-12 w-full rounded-lg border border-line bg-surface px-3.5 text-body-sm text-ink focus:border-black focus:outline-none"
        />
      </div>

      {status === "error" && error && (
        <p role="alert" className="flex items-center gap-1.5 text-body-sm text-risk-danger">
          <Icon name="error" size={16} />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{ boxShadow: "3px 3px 0px #1c1b1b" }}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-black text-label-lg text-white transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-70"
      >
        {status === "loading" ? "Submitting…" : "Submit review"}
      </button>
      <p className="text-label-sm text-ink-faint">Reviews are moderated before publishing and may be edited for length.</p>
    </form>
  );
}
