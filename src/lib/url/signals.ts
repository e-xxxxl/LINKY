import type { ScanSignal } from "@/lib/risk/types";
import { URL_SHORTENERS } from "@/lib/risk/shorteners";
import { findKeywordMatches } from "@/lib/risk/keywords";
import { WATCHED_BRANDS } from "@/lib/risk/brands";
import { levenshteinDistance } from "@/lib/risk/levenshtein";
import { SUSPICIOUS_TLDS } from "@/lib/risk/tlds";

function pass(id: string, label: string, detail: string): ScanSignal {
  return { id, category: "url_structure", label, detail, status: "pass", weight: 0 };
}

export function buildUrlStructureSignals(url: URL, registrableDomain: string): ScanSignal[] {
  const signals: ScanSignal[] = [];
  const fullUrl = url.toString();
  const host = url.hostname;

  // Credentials embedded before the host ("@" trick), e.g. real-bank.com@evil.com,
  // the WHATWG URL parser treats everything before the last "@" as userinfo.
  if (url.username || url.password) {
    signals.push({
      id: "at-symbol",
      category: "url_structure",
      label: "Hidden host using the \"@\" trick",
      detail: "The address uses an \"@\" symbol before the real host, a technique used to disguise the true destination.",
      status: "danger",
      weight: 25,
    });
  } else {
    signals.push(pass("at-symbol", "No hidden host tricks", "The address does not hide its real destination with an \"@\" symbol."));
  }

  const subdomainParts = host.split(".").length;
  if (subdomainParts >= 5) {
    signals.push({
      id: "excessive-subdomains",
      category: "url_structure",
      label: "Excessive subdomains",
      detail: `The host has ${subdomainParts} parts, more than typical legitimate sites.`,
      status: "warning",
      weight: 10,
    });
  } else {
    signals.push(pass("excessive-subdomains", "Normal subdomain depth", "The host does not use an unusual number of subdomains."));
  }

  if (URL_SHORTENERS.has(host)) {
    signals.push({
      id: "url-shortener",
      category: "url_structure",
      label: "URL shortening service",
      detail: `${host} hides the final destination until the link is followed.`,
      status: "warning",
      weight: 8,
    });
  } else {
    signals.push(pass("url-shortener", "Not a shortened link", "This is not a known URL-shortening service."));
  }

  if (fullUrl.length > 150) {
    signals.push({
      id: "long-url",
      category: "url_structure",
      label: "Unusually long URL",
      detail: `The link is ${fullUrl.length} characters long, which can be used to obscure its real content.`,
      status: "warning",
      weight: 6,
    });
  } else {
    signals.push(pass("long-url", "Reasonable URL length", "The link is not unusually long."));
  }

  const encodedMatches = fullUrl.match(/%[0-9a-fA-F]{2}/g) ?? [];
  if (encodedMatches.length > 5) {
    signals.push({
      id: "encoded-characters",
      category: "url_structure",
      label: "Heavily encoded URL",
      detail: `The link contains ${encodedMatches.length} encoded characters, which can be used to hide suspicious content.`,
      status: "warning",
      weight: 10,
    });
  } else {
    signals.push(pass("encoded-characters", "Minimal character encoding", "The link does not rely on heavy character encoding."));
  }

  // Checked on the path/query only, not the hostname, legitimate financial
  // and account-related brands naturally contain these words in their own
  // domain name, whereas phishing pages typically stuff them into the path
  // of an unrelated or lookalike domain.
  const keywordMatches = findKeywordMatches(url.pathname + url.search);
  if (keywordMatches.length > 0) {
    const groups = [...new Set(keywordMatches.map((m) => m.group))];
    signals.push({
      id: "suspicious-keywords",
      category: "url_structure",
      label: "Sensitive-sounding keywords",
      detail: `The link contains terms associated with ${groups.join(", ")} phishing themes ("${keywordMatches[0].term}").`,
      status: "warning",
      weight: Math.min(15, keywordMatches.length * 5),
    });
  } else {
    signals.push(pass("suspicious-keywords", "No alarming keywords", "The link does not contain common phishing-related keywords."));
  }

  if (SUSPICIOUS_TLDS.has(registrableDomain.split(".").pop() ?? "")) {
    signals.push({
      id: "suspicious-tld",
      category: "domain",
      label: "Higher-risk domain extension",
      detail: `The ".${registrableDomain.split(".").pop()}" extension is disproportionately used in spam and phishing campaigns.`,
      status: "warning",
      weight: 12,
    });
  } else {
    signals.push({
      id: "suspicious-tld",
      category: "domain",
      label: "Common domain extension",
      detail: "The domain extension is not one commonly associated with abuse.",
      status: "pass",
      weight: 0,
    });
  }

  const brandMatch = findLookalikeBrand(registrableDomain);
  if (brandMatch) {
    signals.push({
      id: "lookalike-domain",
      category: "domain",
      label: "Possible brand impersonation",
      detail: `"${registrableDomain}" closely resembles "${brandMatch}.com" but is not the official domain.`,
      status: "danger",
      weight: 30,
    });
  } else {
    signals.push(pass("lookalike-domain", "No brand impersonation detected", "The domain does not closely resemble a widely recognized brand."));
  }

  return signals;
}

function findLookalikeBrand(registrableDomain: string): string | null {
  const name = registrableDomain.split(".")[0]?.toLowerCase() ?? "";
  if (!name) return null;
  if (WATCHED_BRANDS.includes(name)) return null; // exact match to the brand's own domain

  // Evaluate each hyphen-delimited segment on its own ("secure-paypa1-login"
  // -> ["secure", "paypa1", "login"]) rather than the whole label, so a
  // typosquat buried in one segment of a longer domain isn't diluted by the
  // surrounding words when comparing lengths/edit-distance.
  const segments = name.split("-").filter(Boolean);

  for (const brand of WATCHED_BRANDS) {
    for (const segment of segments) {
      if (segment === brand) return brand;

      // Typo-squat detection (e.g. "paypa1", "arnazon") is only reliable for
      // longer brand names; short names produce too many coincidental
      // low-edit-distance matches against unrelated words.
      if (brand.length >= 5) {
        const distance = levenshteinDistance(segment, brand);
        if (distance > 0 && distance <= 2 && Math.abs(segment.length - brand.length) <= 2) {
          return brand;
        }
      }
    }
  }
  return null;
}
