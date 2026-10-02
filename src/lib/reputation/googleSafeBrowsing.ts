import type { ReputationResult } from "@/lib/risk/types";

const TIMEOUT_MS = 4000;

export async function checkGoogleSafeBrowsing(targetUrl: string): Promise<ReputationResult> {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    return {
      provider: "Google Safe Browsing",
      available: false,
      verdict: "unavailable",
      detail: "Not available. No API key configured.",
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { clientId: "linky", clientVersion: "1.0.0" },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: targetUrl }],
          },
        }),
      },
    );

    if (!res.ok) {
      return {
        provider: "Google Safe Browsing",
        available: false,
        verdict: "unavailable",
        detail: "The reputation check could not be completed right now.",
      };
    }

    const data = (await res.json()) as { matches?: { threatType: string }[] };
    if (data.matches && data.matches.length > 0) {
      const types = [...new Set(data.matches.map((m) => m.threatType))].join(", ");
      return {
        provider: "Google Safe Browsing",
        available: true,
        verdict: "flagged",
        detail: `Listed for: ${types.toLowerCase().replace(/_/g, " ")}.`,
      };
    }

    return {
      provider: "Google Safe Browsing",
      available: true,
      verdict: "clean",
      detail: "No known threats found.",
    };
  } catch {
    return {
      provider: "Google Safe Browsing",
      available: false,
      verdict: "unavailable",
      detail: "The reputation check could not be completed right now.",
    };
  } finally {
    clearTimeout(timer);
  }
}
