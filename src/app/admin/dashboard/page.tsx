"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { RiskLevel } from "@/lib/risk/types";

interface AdminScan {
  id: string;
  normalizedUrl: string;
  host: string;
  riskLevel: RiskLevel;
  riskScore: number;
  createdAt: string;
}

interface AdminReviewRow {
  id: string;
  name: string;
  rating: number;
  reviewText: string;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  isDemo: boolean;
  createdAt: string;
}

type Tab = "scans" | "reviews" | "providers";

const REVIEW_STATUS_STYLE: Record<AdminReviewRow["status"], string> = {
  pending: "text-risk-caution border-risk-caution",
  approved: "text-risk-safe border-risk-safe",
  rejected: "text-risk-danger border-risk-danger",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("scans");
  const [scans, setScans] = useState<AdminScan[] | null>(null);
  const [reviews, setReviews] = useState<AdminReviewRow[] | null>(null);
  const [providers, setProviders] = useState<Record<string, boolean> | null>(null);
  const [authError, setAuthError] = useState(false);

  const handleUnauthorized = useCallback(() => {
    setAuthError(true);
    router.push("/admin");
  }, [router]);

  useEffect(() => {
    if (tab === "scans" && scans === null) {
      fetch("/api/admin/scans")
        .then(async (res) => {
          if (res.status === 401) return handleUnauthorized();
          const data = await res.json();
          setScans(data.scans);
        })
        .catch(() => setScans([]));
    }
    if (tab === "reviews" && reviews === null) {
      fetch("/api/admin/reviews")
        .then(async (res) => {
          if (res.status === 401) return handleUnauthorized();
          const data = await res.json();
          setReviews(data.reviews);
        })
        .catch(() => setReviews([]));
    }
    if (tab === "providers" && providers === null) {
      fetch("/api/admin/providers")
        .then(async (res) => {
          if (res.status === 401) return handleUnauthorized();
          const data = await res.json();
          setProviders(data.providers);
        })
        .catch(() => setProviders({}));
    }
  }, [tab, scans, reviews, providers, handleUnauthorized]);

  async function moderate(id: string, status: "approved" | "rejected") {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setReviews((prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
    }
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  if (authError) return null;

  return (
    <div className="mx-auto max-w-6xl px-margin-mobile py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-headline-sm text-black">Dashboard</h1>
        <button onClick={signOut} className="text-body-sm font-medium text-ink-muted transition-colors hover:text-black">
          Sign out
        </button>
      </div>

      <div className="mt-8 flex gap-1 border-b border-line">
        {(["scans", "reviews", "providers"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-label-md transition-colors ${
              tab === t ? "border-black text-black" : "border-transparent text-ink-muted hover:text-black"
            }`}
          >
            {t === "scans" ? "Scans" : t === "reviews" ? "Reviews" : "Providers"}
          </button>
        ))}
      </div>

      {tab === "scans" && (
        <div className="mt-6 overflow-hidden rounded-xl bg-surface-lowest shadow-sm">
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-line bg-surface-low">
              <tr>
                <th className="px-4 py-2.5 text-label-sm text-ink-muted">Host</th>
                <th className="px-4 py-2.5 text-label-sm text-ink-muted">Result</th>
                <th className="px-4 py-2.5 text-label-sm text-ink-muted">Score</th>
                <th className="px-4 py-2.5 text-label-sm text-ink-muted">Scanned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(scans ?? []).map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-mono-url text-ink break-all">{s.host}</td>
                  <td className="px-4 py-3">
                    <StatusBadge level={s.riskLevel} />
                  </td>
                  <td className="px-4 py-3 font-mono-url text-ink-muted">{s.riskScore}/100</td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDateTime(s.createdAt)}</td>
                </tr>
              ))}
              {scans !== null && scans.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                    No scans yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "reviews" && (
        <div className="mt-6 flex flex-col gap-space-sm">
          {(reviews ?? []).map((r) => (
            <div key={r.id} className="rounded-xl bg-surface-lowest p-space-sm shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-body-sm font-semibold text-ink">
                    {r.name} · {r.rating}/5
                    {r.isDemo && <span className="ml-2 text-label-sm text-ink-faint">(demo)</span>}
                  </p>
                  <p className="mt-1 max-w-xl text-body-sm text-ink-muted">{r.reviewText}</p>
                  {r.reason && <p className="mt-1 text-label-sm text-ink-faint">Reason: {r.reason}</p>}
                  <p className="mt-1 text-label-sm text-ink-faint">{formatDateTime(r.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full border px-2 py-1 text-label-sm uppercase ${REVIEW_STATUS_STYLE[r.status]}`}>
                    {r.status}
                  </span>
                  {r.status !== "approved" && (
                    <button
                      onClick={() => moderate(r.id, "approved")}
                      className="rounded-lg border border-line px-2.5 py-1.5 text-label-sm text-ink transition-colors hover:border-risk-safe hover:text-risk-safe"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      onClick={() => moderate(r.id, "rejected")}
                      className="rounded-lg border border-line px-2.5 py-1.5 text-label-sm text-ink transition-colors hover:border-risk-danger hover:text-risk-danger"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {reviews !== null && reviews.length === 0 && (
            <p className="py-8 text-center text-body-sm text-ink-muted">No reviews yet.</p>
          )}
        </div>
      )}

      {tab === "providers" && (
        <div className="mt-6 divide-y divide-line rounded-xl bg-surface-lowest shadow-sm">
          {providers &&
            Object.entries(providers).map(([key, configured]) => (
              <div key={key} className="flex items-center justify-between px-5 py-4">
                <span className="text-body-sm text-ink">
                  {key === "googleSafeBrowsing" ? "Google Safe Browsing" : "VirusTotal"}
                </span>
                <span
                  className={`rounded-full border px-2 py-1 text-label-sm uppercase ${
                    configured ? "border-risk-safe text-risk-safe" : "border-line text-ink-muted"
                  }`}
                >
                  {configured ? "Configured" : "Not configured"}
                </span>
              </div>
            ))}
          <p className="px-5 py-4 text-label-sm text-ink-faint">
            Set GOOGLE_SAFE_BROWSING_API_KEY and VIRUSTOTAL_API_KEY as environment variables to
            enable a provider.
          </p>
        </div>
      )}
    </div>
  );
}
