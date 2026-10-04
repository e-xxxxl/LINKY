import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSessionId } from "@/lib/session";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icon";
import { formatDateCompact } from "@/lib/format";
import type { RiskLevel } from "@/lib/risk/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scan History",
  description: "Links you've scanned with LINKY on this device.",
  robots: { index: false, follow: false },
};

export default async function HistoryPage() {
  const sessionId = await getSessionId();
  const scans = sessionId
    ? await prisma.scan.findMany({
        where: { sessionId },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: { id: true, host: true, riskLevel: true, riskScore: true, createdAt: true },
      })
    : [];

  return (
    <div className="flex flex-col gap-space-md px-margin-mobile pb-space-lg pt-space-md">
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-display text-headline-md tracking-tight text-black">Scan history</h1>
        <p className="text-body-sm leading-relaxed text-ink-muted">
          No account needed. This list is tied to your browser, not a profile.
        </p>
      </div>

      {scans.length === 0 ? (
        <div className="flex flex-col items-center gap-space-sm rounded-2xl bg-surface-lowest p-space-xl text-center shadow-sm">
          <Icon name="history" size={32} className="text-ink-faint" />
          <p className="text-body-sm text-ink-muted">You haven&rsquo;t scanned any links yet.</p>
          <Link href="/#scanner" className="text-label-md font-semibold text-black underline underline-offset-2">
            Scan your first link
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {scans.map((scan) => (
            <Link
              key={scan.id}
              href={`/scan/${scan.id}`}
              className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-lowest p-space-sm shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-mono-url text-body-sm text-ink">{scan.host}</span>
                <div className="flex items-center gap-2 text-label-sm text-ink-faint">
                  <span>{formatDateCompact(scan.createdAt.toISOString())}</span>
                  <span>·</span>
                  <span>{scan.riskScore}/100</span>
                </div>
              </div>
              <StatusBadge level={scan.riskLevel as RiskLevel} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
