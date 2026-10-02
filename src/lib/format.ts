export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateCompact(iso: string): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  return `${day} ${month}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const RISK_LEVEL_LABEL: Record<string, string> = {
  SAFE: "Safe",
  LOW_RISK: "Low Risk",
  SUSPICIOUS: "Suspicious",
  HIGH_RISK: "High Risk",
  MALICIOUS: "Malicious",
};
