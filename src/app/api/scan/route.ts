import { NextResponse } from "next/server";
import { normalizeUrl } from "@/lib/url/normalize";
import { runScan } from "@/lib/risk/engine";
import { prisma } from "@/lib/db";
import { getOrCreateSessionId } from "@/lib/session";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";
import { consumeScanQuota, SCAN_LIMIT } from "@/lib/scanQuota";
import { scanRequestSchema } from "@/lib/validation";

// A scan can chain DNS, up to 5 redirect hops, RDAP and reputation lookups.
export const maxDuration = 30;

function waitText(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / 60000));
  return minutes === 1 ? "about a minute" : `about ${minutes} minutes`;
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request.headers);

  // Cheap per-instance guard against rapid-fire requests.
  const burst = checkRateLimit(`scan:${clientKey}`);
  if (!burst.allowed) {
    return NextResponse.json(
      { error: "You're scanning too quickly. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsedBody = scanRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Enter a URL to scan." }, { status: 400 });
  }

  const normalized = normalizeUrl(parsedBody.data.url);
  if (!normalized.ok || !normalized.url) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  // Invalid input above never uses up quota; only real scan attempts do.
  const quota = await consumeScanQuota(clientKey);
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: `You've used your ${SCAN_LIMIT} free scans for this hour. You can scan again in ${waitText(quota.retryAfterMs)}.`,
        retryAfterSeconds: Math.ceil(quota.retryAfterMs / 1000),
      },
      { status: 429, headers: { "Retry-After": String(Math.ceil(quota.retryAfterMs / 1000)) } },
    );
  }

  let result;
  try {
    result = await runScan(normalized.url);
  } catch {
    return NextResponse.json(
      { error: "We couldn't complete the scan right now. You can try again." },
      { status: 502 },
    );
  }

  const sessionId = await getOrCreateSessionId();

  const scan = await prisma.scan.create({
    data: {
      sessionId,
      originalUrl: result.originalUrl,
      normalizedUrl: result.normalizedUrl,
      host: result.host,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      summary: result.summary,
      reasons: JSON.stringify(result.reasons),
      signals: JSON.stringify(result.signals),
      redirectChain: JSON.stringify(result.redirectChain),
      domain: JSON.stringify(result.domain),
      reputation: JSON.stringify(result.reputation),
    },
  });

  return NextResponse.json({ id: scan.id });
}
