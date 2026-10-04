// In-memory sliding-window rate limiter. Good enough for a single Next.js
// instance; a multi-instance deployment would need a shared store (e.g.
// Redis) instead.

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 20);
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    const oldest = bucket.timestamps[0];
    buckets.set(key, bucket);
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldest) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, retryAfterMs: 0 };
}

// Periodically evict stale buckets so memory doesn't grow unbounded.
if (!(globalThis as unknown as { __linkyRateLimitCleanup?: boolean }).__linkyRateLimitCleanup) {
  (globalThis as unknown as { __linkyRateLimitCleanup?: boolean }).__linkyRateLimitCleanup = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
      if (bucket.timestamps.length === 0) buckets.delete(key);
    }
  }, WINDOW_MS).unref();
}

export function getClientKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
