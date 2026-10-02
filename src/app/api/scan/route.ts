import { NextResponse } from "next/server";
import { normalizeUrl } from "@/lib/url/normalize";
import { runScan } from "@/lib/risk/engine";
import { prisma } from "@/lib/db";
import { getOrCreateSessionId } from "@/lib/session";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";
import { scanRequestSchema } from "@/lib/validation";

// A scan can chain DNS, up to 5 redirect hops, RDAP and reputation lookups.
export const maxDuration = 30;

export async function POST(request: Request) {
  const clientKey = getClientKey(request.headers);
  const rateLimit = checkRateLimit(`scan:${clientKey}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "You've reached the scan limit. Please wait a moment and try again." },
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
