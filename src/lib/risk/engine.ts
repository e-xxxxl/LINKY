import { parse } from "tldts";
import type {
  DomainInfo,
  RedirectHop,
  ReputationResult,
  RiskLevel,
  ScanReport,
  ScanSignal,
} from "./types";
import { buildUrlStructureSignals } from "@/lib/url/signals";
import { analyzeDomain } from "@/lib/domain/analyze";
import { safeFetchChain } from "@/lib/security/safeFetch";
import { checkReputation } from "@/lib/reputation";

function buildDomainSignals(domain: DomainInfo): ScanSignal[] {
  const signals: ScanSignal[] = [];

  if (!domain.https) {
    signals.push({
      id: "no-https",
      category: "domain",
      label: "No secure connection",
      detail: "This link does not use HTTPS, so any data submitted could be intercepted.",
      status: "danger",
      weight: 20,
    });
  } else {
    signals.push({
      id: "no-https",
      category: "domain",
      label: "Secure connection",
      detail: "This link uses HTTPS.",
      status: "pass",
      weight: 0,
    });
  }

  if (domain.isIpAddress) {
    signals.push({
      id: "ip-address-host",
      category: "domain",
      label: "IP address instead of a domain",
      detail: "The link points directly to a numeric IP address rather than a named domain, a pattern rarely used by legitimate sites.",
      status: "danger",
      weight: 35,
    });
  } else {
    signals.push({
      id: "ip-address-host",
      category: "domain",
      label: "Uses a named domain",
      detail: "The link points to a named domain rather than a raw IP address.",
      status: "pass",
      weight: 0,
    });
  }

  if (!domain.isIpAddress) {
    if (domain.isPunycode) {
      signals.push({
        id: "punycode",
        category: "domain",
        label: "Internationalized domain (punycode)",
        detail: "This domain uses encoded international characters, sometimes used to mimic a familiar brand visually.",
        status: "warning",
        weight: 15,
      });
    } else {
      signals.push({
        id: "punycode",
        category: "domain",
        label: "Standard character set",
        detail: "The domain does not use encoded international characters.",
        status: "pass",
        weight: 0,
      });
    }

    if (domain.ageAvailable && domain.ageDays !== null) {
      if (domain.ageDays < 30) {
        signals.push({
          id: "domain-age",
          category: "domain",
          label: "Very recently registered domain",
          detail: `This domain was registered approximately ${domain.ageDays} day(s) ago. New domains are disproportionately used in short-lived scams.`,
          status: "danger",
          weight: 20,
        });
      } else if (domain.ageDays < 180) {
        signals.push({
          id: "domain-age",
          category: "domain",
          label: "Recently registered domain",
          detail: `This domain was registered approximately ${domain.ageDays} day(s) ago.`,
          status: "warning",
          weight: 8,
        });
      } else {
        signals.push({
          id: "domain-age",
          category: "domain",
          label: "Established domain",
          detail: `This domain has been registered for roughly ${Math.floor(domain.ageDays / 365)} year(s).`,
          status: "pass",
          weight: 0,
        });
      }
    } else {
      signals.push({
        id: "domain-age",
        category: "domain",
        label: "Domain age",
        detail: "Not available for this domain.",
        status: "unavailable",
        weight: 0,
      });
    }
  }

  return signals;
}

function buildRedirectSignals(
  originalHost: string,
  hops: { url: string }[],
  blocked: boolean,
  blockedReason: string | null,
  error: string | null,
): ScanSignal[] {
  if (blocked) {
    return [
      {
        id: "redirect-blocked",
        category: "redirects",
        label: "Redirect check blocked",
        detail: blockedReason ?? "LINKY blocked this request for safety reasons.",
        status: "info",
        weight: 0,
      },
    ];
  }

  if (hops.length <= 1) {
    if (error) {
      return [
        {
          id: "redirect-unavailable",
          category: "redirects",
          label: "Redirect check unavailable",
          detail: error,
          status: "unavailable",
          weight: 0,
        },
      ];
    }
    return [
      {
        id: "no-redirects",
        category: "redirects",
        label: "No redirects",
        detail: "This link goes directly to its destination without redirecting.",
        status: "pass",
        weight: 0,
      },
    ];
  }

  const hosts = hops.map((h) => {
    try {
      return new URL(h.url).hostname;
    } catch {
      return h.url;
    }
  });
  const uniqueHosts = [...new Set(hosts)];
  const finalHost = hosts[hosts.length - 1];

  const signals: ScanSignal[] = [];

  if (finalHost !== originalHost) {
    signals.push({
      id: "redirect-domain-change",
      category: "redirects",
      label: "Redirects to a different domain",
      detail: `${originalHost} redirects to ${finalHost} through ${hops.length - 1} hop(s).`,
      status: uniqueHosts.length > 2 ? "danger" : "warning",
      weight: uniqueHosts.length > 2 ? 15 : 10,
    });
  } else {
    signals.push({
      id: "redirect-domain-change",
      category: "redirects",
      label: "Redirects stay on the same domain",
      detail: "This link redirects but ends on the same domain it started from.",
      status: "pass",
      weight: 0,
    });
  }

  return signals;
}

function buildReputationSignals(results: ReputationResult[]): ScanSignal[] {
  return results.map((r) => {
    if (!r.available) {
      return {
        id: `reputation-${r.provider}`,
        category: "reputation" as const,
        label: r.provider,
        detail: r.detail,
        status: "unavailable" as const,
        weight: 0,
      };
    }
    if (r.verdict === "flagged") {
      return {
        id: `reputation-${r.provider}`,
        category: "reputation" as const,
        label: `${r.provider}: flagged`,
        detail: r.detail,
        status: "danger" as const,
        weight: 60,
      };
    }
    return {
      id: `reputation-${r.provider}`,
      category: "reputation" as const,
      label: `${r.provider}: clean`,
      detail: r.detail,
      status: "pass" as const,
      weight: 0,
    };
  });
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 80) return "MALICIOUS";
  if (score >= 60) return "HIGH_RISK";
  if (score >= 35) return "SUSPICIOUS";
  if (score >= 15) return "LOW_RISK";
  return "SAFE";
}

const LEVEL_SUMMARY: Record<RiskLevel, string> = {
  SAFE: "LINKY did not find significant risk signals for this link. Always stay cautious before entering sensitive information anywhere online.",
  LOW_RISK: "This link looks mostly fine, but a small number of minor signals are worth noting.",
  SUSPICIOUS: "This link contains several signals commonly associated with suspicious or misleading websites.",
  HIGH_RISK: "This link shows strong indicators of phishing or fraud. We recommend not opening it.",
  MALICIOUS: "This link matches signals strongly associated with known malicious or phishing activity. Do not open it or enter any information.",
};

export async function runScan(url: URL): Promise<Omit<ScanReport, "id" | "createdAt">> {
  const parsedHost = parse(url.hostname);
  const registrableDomain = parsedHost.domain ?? url.hostname;

  const [domain, redirectResult, reputation] = await Promise.all([
    analyzeDomain(url),
    safeFetchChain(url.toString()),
    checkReputation(url.toString()),
  ]);

  const domainSignals = buildDomainSignals(domain);
  const urlSignals = buildUrlStructureSignals(url, registrableDomain);
  const redirectSignals = buildRedirectSignals(
    url.hostname,
    redirectResult.hops,
    redirectResult.blocked,
    redirectResult.blockedReason,
    redirectResult.error,
  );
  const reputationSignals = buildReputationSignals(reputation);

  const allSignals = [...domainSignals, ...urlSignals, ...redirectSignals, ...reputationSignals];
  const rawScore = allSignals.reduce((sum, s) => sum + s.weight, 0);
  const riskScore = Math.max(0, Math.min(100, rawScore));
  const riskLevel = scoreToLevel(riskScore);

  const reasons = allSignals
    .filter((s) => s.status === "danger" || s.status === "warning")
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((s) => s.detail);

  return {
    originalUrl: url.toString(),
    normalizedUrl: url.toString(),
    host: url.hostname,
    riskLevel,
    riskScore,
    summary: LEVEL_SUMMARY[riskLevel],
    reasons,
    signals: allSignals,
    redirectChain: redirectResult.hops.map((h) => ({
      url: h.url,
      host: (() => {
        try {
          return new URL(h.url).hostname;
        } catch {
          return h.url;
        }
      })(),
      status: h.status,
    })),
    domain,
    reputation,
  };
}
