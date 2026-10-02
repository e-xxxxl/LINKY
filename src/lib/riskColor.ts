import type { RiskLevel } from "@/lib/risk/types";

export const RISK_COLOR: Record<RiskLevel, string> = {
  SAFE: "#1e8e3e",
  LOW_RISK: "#1e8e3e",
  SUSPICIOUS: "#d98a00",
  HIGH_RISK: "#ba1a1a",
  MALICIOUS: "#ba1a1a",
};

export const RISK_TINT: Record<RiskLevel, string> = {
  SAFE: "#e4f3e8",
  LOW_RISK: "#e4f3e8",
  SUSPICIOUS: "#fbecd4",
  HIGH_RISK: "#ffdad6",
  MALICIOUS: "#ffdad6",
};

export function isSafeLevel(level: RiskLevel): boolean {
  return level === "SAFE" || level === "LOW_RISK";
}
