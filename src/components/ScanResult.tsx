"use client";

import { useState } from "react";
import Link from "next/link";
import type { ScanReport, ScanSignal } from "@/lib/risk/types";
import { RiskMeter } from "./RiskMeter";
import { Icon } from "./Icon";
import { ShieldCheckIllustration, BrokenLinkWarningIllustration } from "./illustrations/VerdictIcons";
import { RISK_COLOR, isSafeLevel } from "@/lib/riskColor";
import { RISK_LEVEL_LABEL } from "@/lib/format";
import { buildTextReport } from "@/lib/report";

const STATUS_PILL_TEXT: Record<ScanReport["riskLevel"], string> = {
  SAFE: "Verdict status",
  LOW_RISK: "Verdict status",
  SUSPICIOUS: "Caution advised",
  HIGH_RISK: "High risk detected",
  MALICIOUS: "Malicious activity",
};

const STATUS_WORD: Record<ScanSignal["status"], string> = {
  pass: "Pass",
  info: "Noted",
  warning: "Suspicious",
  danger: "Risk",
  unavailable: "Not available",
};

const STATUS_COLOR: Record<ScanSignal["status"], string> = {
  pass: "#1e8e3e",
  info: "#444748",
  warning: "#d98a00",
  danger: "#ba1a1a",
  unavailable: "#747878",
};

export function ScanResult({ report }: { report: ScanReport }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const safe = isSafeLevel(report.riskLevel);
  const color = RISK_COLOR[report.riskLevel];

  const flagged = [...report.signals]
    .filter((s) => s.status === "danger" || s.status === "warning")
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);
  const reassuring = report.signals.filter((s) => s.status === "pass").slice(0, 3);
  const evidence = flagged.length > 0 ? flagged : reassuring;
  const evidenceIsPositive = flagged.length === 0;

  async function handleShare() {
    const text = buildTextReport(report);
    if (navigator.share) {
      try {
        await navigator.share({ title: `LINKY: ${RISK_LEVEL_LABEL[report.riskLevel]} report`, text });
        return;
      } catch {
        // user dismissed the share sheet, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; the report text remains visible on the page
    }
  }

  return (
    <div className="flex flex-col gap-space-md pb-space-xl pt-space-xs">
      {/* Scanned URL */}
      <div className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-low p-space-sm">
        <div className="flex min-w-0 items-center gap-space-xs pl-1">
          <Icon name={report.domain.https ? "link" : "link_off"} size={18} className="shrink-0 text-ink-faint" />
          <span className="truncate text-body-sm tracking-tight text-ink">{report.normalizedUrl}</span>
        </div>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Copy scanned URL"
          className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-surface-lowest px-2.5 text-label-sm uppercase text-ink transition-transform active:scale-95"
        >
          <Icon name={copied ? "check" : "content_copy"} size={16} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Verdict hero */}
      <div className="flex flex-col items-center rounded-2xl bg-surface-lowest p-space-md text-center shadow-md">
        {safe ? <ShieldCheckIllustration color={color} /> : <BrokenLinkWarningIllustration color={color} />}

        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-label-sm uppercase tracking-wider text-ink-muted">
            {STATUS_PILL_TEXT[report.riskLevel]}
          </span>
        </div>
        <h2 className="font-display text-headline-lg uppercase leading-none tracking-tight" style={{ color }}>
          {RISK_LEVEL_LABEL[report.riskLevel]}
        </h2>

        <div className="mt-space-sm w-full">
          <div className="flex items-baseline justify-between px-1">
            <span className="text-label-md uppercase text-ink-muted">Risk score</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-headline-lg font-bold leading-none" style={{ color }}>
                {report.riskScore}
              </span>
              <span className="text-label-md text-ink-muted">/ 100</span>
            </div>
          </div>
          <RiskMeter score={report.riskScore} />
        </div>
      </div>

      {/* Evidence */}
      {evidence.length > 0 && (
        <div className="rounded-2xl bg-surface-lowest p-space-md shadow-md">
          <div className="mb-space-sm flex items-center gap-2">
            <Icon name={evidenceIsPositive ? "task_alt" : "crisis_alert"} size={20} style={{ color }} />
            <h3 className="font-display text-title-md tracking-tight text-ink">
              {evidenceIsPositive ? "Why this looks safe" : `Top ${evidence.length} red flags`}
            </h3>
          </div>
          <div className="flex flex-col gap-space-sm">
            {evidence.map((signal, i) => (
              <div key={signal.id} className="flex items-start gap-3 rounded-xl bg-surface-low/70 p-space-sm">
                {evidenceIsPositive ? (
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${color}26` }}
                  >
                    <Icon name="check_circle" size={18} style={{ color }} />
                  </div>
                ) : (
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}26`, color }}
                  >
                    <span className="text-label-sm">{i + 1}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-label-md font-semibold text-ink">{signal.label}</span>
                  <p className="mt-0.5 text-body-sm leading-snug text-ink-muted">{signal.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full signal details */}
      <details
        className="overflow-hidden rounded-xl bg-surface-lowest shadow-sm"
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex h-[52px] cursor-pointer list-none items-center justify-between bg-surface-low px-space-md transition-colors active:bg-surface">
          <span className="text-label-md text-ink">View full signal details ({report.signals.length} checks)</span>
          <Icon
            name="expand_more"
            size={20}
            className="text-black transition-transform duration-200"
            style={detailsOpen ? { transform: "rotate(180deg)" } : undefined}
          />
        </summary>
        <div className="flex flex-col gap-space-sm p-space-md">
          {report.signals.map((signal) => (
            <div key={signal.id} className="flex items-center justify-between py-1">
              <span className="text-body-sm text-ink-muted">{signal.label}</span>
              <span className="text-label-sm font-semibold" style={{ color: STATUS_COLOR[signal.status] }}>
                {STATUS_WORD[signal.status]}
              </span>
            </div>
          ))}
        </div>
      </details>

      {/* Actions */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <Link
          href="/"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-black text-label-lg text-white shadow-md transition-transform active:scale-[0.98]"
        >
          <Icon name="document_scanner" size={20} />
          <span>Scan another link</span>
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-surface-low text-label-lg text-ink transition-colors active:bg-surface"
        >
          <Icon name="share" size={20} />
          <span>{copied ? "Report copied!" : "Share report"}</span>
        </button>
      </div>
    </div>
  );
}
