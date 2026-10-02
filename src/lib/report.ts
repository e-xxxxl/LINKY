import type { ScanReport } from "@/lib/risk/types";
import { RISK_LEVEL_LABEL } from "@/lib/format";

export function buildTextReport(report: ScanReport): string {
  const lines = [
    "LINKY Security Report",
    report.normalizedUrl,
    "",
    `Result: ${RISK_LEVEL_LABEL[report.riskLevel]} (${report.riskScore}/100)`,
    report.summary,
  ];

  if (report.reasons.length > 0) {
    lines.push("", "Why LINKY flagged this:");
    report.reasons.forEach((reason, i) => lines.push(`${i + 1}. ${reason}`));
  }

  lines.push("", `Full report: ${typeof window !== "undefined" ? window.location.origin : ""}/scan/${report.id}`);

  return lines.join("\n");
}
