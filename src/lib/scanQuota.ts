import { createHash } from "node:crypto";
import { prisma } from "./db";

/** Free scans allowed per visitor per rolling hour. */
export const SCAN_LIMIT = Number(process.env.SCAN_LIMIT_PER_HOUR ?? 5);
const WINDOW_MS = 60 * 60 * 1000;

export interface QuotaResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

// Only a salted hash of the IP is stored, never the address itself.
function keyFor(ip: string): string {
  return createHash("sha256")
    .update(`${ip}|${process.env.SESSION_SECRET ?? ""}`)
    .digest("hex")
    .slice(0, 32);
}

// Fallback used only if the database is unreachable (or the RateHit table has
// not been created yet). It is per server instance, so it is a safety net,
// not the real limiter.
const memory = new Map<string, number[]>();

function consumeInMemory(key: string): QuotaResult {
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= SCAN_LIMIT) {
    memory.set(key, recent);
    return { allowed: false, remaining: 0, retryAfterMs: recent[0] + WINDOW_MS - now };
  }
  recent.push(now);
  memory.set(key, recent);
  return { allowed: true, remaining: SCAN_LIMIT - recent.length, retryAfterMs: 0 };
}

/** Records one scan against the visitor's hourly quota, or refuses it. */
export async function consumeScanQuota(ip: string): Promise<QuotaResult> {
  const key = keyFor(ip);
  const now = Date.now();

  try {
    const hits = await prisma.rateHit.findMany({
      where: { key, createdAt: { gt: new Date(now - WINDOW_MS) } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    if (hits.length >= SCAN_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, hits[0].createdAt.getTime() + WINDOW_MS - now),
      };
    }

    await prisma.rateHit.create({ data: { key } });

    // Occasionally prune old rows so the table stays small.
    if (Math.random() < 0.02) {
      prisma.rateHit
        .deleteMany({ where: { createdAt: { lt: new Date(now - 2 * WINDOW_MS) } } })
        .catch(() => {});
    }

    return { allowed: true, remaining: SCAN_LIMIT - hits.length - 1, retryAfterMs: 0 };
  } catch {
    return consumeInMemory(key);
  }
}
