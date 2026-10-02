import type { Scan } from "@prisma/client";
import type { ScanReport } from "@/lib/risk/types";

export function toScanReport(scan: Scan): ScanReport {
  return {
    id: scan.id,
    originalUrl: scan.originalUrl,
    normalizedUrl: scan.normalizedUrl,
    host: scan.host,
    riskLevel: scan.riskLevel as ScanReport["riskLevel"],
    riskScore: scan.riskScore,
    summary: scan.summary,
    reasons: JSON.parse(scan.reasons),
    signals: JSON.parse(scan.signals),
    redirectChain: JSON.parse(scan.redirectChain),
    domain: JSON.parse(scan.domain),
    reputation: JSON.parse(scan.reputation),
    createdAt: scan.createdAt.toISOString(),
  };
}
