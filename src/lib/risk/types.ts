export type RiskLevel = "SAFE" | "LOW_RISK" | "SUSPICIOUS" | "HIGH_RISK" | "MALICIOUS";

export type SignalStatus = "pass" | "info" | "warning" | "danger" | "unavailable";

export type SignalCategory = "domain" | "url_structure" | "redirects" | "reputation";

export interface ScanSignal {
  id: string;
  category: SignalCategory;
  label: string;
  detail: string;
  status: SignalStatus;
  weight: number;
}

export interface RedirectHop {
  url: string;
  host: string;
  status: number | null;
}

export interface DomainInfo {
  registrableDomain: string;
  subdomain: string;
  tld: string;
  isIpAddress: boolean;
  isPunycode: boolean;
  https: boolean;
  ageDays: number | null;
  ageAvailable: boolean;
  registrar: string | null;
}

export interface ReputationResult {
  provider: string;
  available: boolean;
  verdict: "clean" | "flagged" | "unavailable";
  detail: string;
}

export interface ScanReport {
  id: string;
  originalUrl: string;
  normalizedUrl: string;
  host: string;
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  reasons: string[];
  signals: ScanSignal[];
  redirectChain: RedirectHop[];
  domain: DomainInfo;
  reputation: ReputationResult[];
  createdAt: string;
}
