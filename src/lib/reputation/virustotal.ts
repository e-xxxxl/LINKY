import type { ReputationResult } from "@/lib/risk/types";

const TIMEOUT_MS = 4000;

function toUrlId(targetUrl: string): string {
  return Buffer.from(targetUrl).toString("base64url").replace(/=+$/, "");
}

export async function checkVirusTotal(targetUrl: string): Promise<ReputationResult> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return {
      provider: "VirusTotal",
      available: false,
      verdict: "unavailable",
      detail: "Not available. No API key configured.",
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const urlId = toUrlId(targetUrl);
    const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      signal: controller.signal,
      headers: { "x-apikey": apiKey },
    });

    if (res.status === 404) {
      return {
        provider: "VirusTotal",
        available: true,
        verdict: "clean",
        detail: "This URL has no prior scan history on VirusTotal.",
      };
    }

    if (!res.ok) {
      return {
        provider: "VirusTotal",
        available: false,
        verdict: "unavailable",
        detail: "The reputation check could not be completed right now.",
      };
    }

    const data = (await res.json()) as {
      data?: { attributes?: { last_analysis_stats?: Record<string, number> } };
    };
    const stats = data.data?.attributes?.last_analysis_stats;
    const malicious = stats?.malicious ?? 0;
    const suspicious = stats?.suspicious ?? 0;

    if (malicious > 0 || suspicious > 0) {
      return {
        provider: "VirusTotal",
        available: true,
        verdict: "flagged",
        detail: `${malicious} engine(s) flagged this as malicious, ${suspicious} as suspicious.`,
      };
    }

    return {
      provider: "VirusTotal",
      available: true,
      verdict: "clean",
      detail: "No security vendors flagged this URL.",
    };
  } catch {
    return {
      provider: "VirusTotal",
      available: false,
      verdict: "unavailable",
      detail: "The reputation check could not be completed right now.",
    };
  } finally {
    clearTimeout(timer);
  }
}
