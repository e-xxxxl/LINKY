import type { ReputationResult } from "@/lib/risk/types";
import { checkGoogleSafeBrowsing } from "./googleSafeBrowsing";
import { checkVirusTotal } from "./virustotal";

export async function checkReputation(targetUrl: string): Promise<ReputationResult[]> {
  const [safeBrowsing, virusTotal] = await Promise.all([
    checkGoogleSafeBrowsing(targetUrl),
    checkVirusTotal(targetUrl),
  ]);
  return [safeBrowsing, virusTotal];
}

export function providerConfigStatus() {
  return {
    googleSafeBrowsing: Boolean(process.env.GOOGLE_SAFE_BROWSING_API_KEY),
    virusTotal: Boolean(process.env.VIRUSTOTAL_API_KEY),
  };
}
