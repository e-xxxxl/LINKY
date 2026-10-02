import { promises as dns } from "node:dns";
import http from "node:http";
import https from "node:https";
import type { LookupAddress } from "node:dns";
import { isBlockedIp } from "./ipGuard";

export interface SafeFetchHop {
  url: string;
  status: number | null;
  location: string | null;
}

export interface SafeFetchResult {
  hops: SafeFetchHop[];
  finalUrl: string;
  finalStatus: number | null;
  blocked: boolean;
  blockedReason: string | null;
  error: string | null;
}

const MAX_HOPS = 5;
const HOP_TIMEOUT_MS = 5000;
const DNS_TIMEOUT_MS = 5000;
const ALLOWED_PORTS = new Set(["", "80", "443"]);

type ResolveResult =
  | { ok: true; ip: string }
  | { ok: false, reason: "not_found" | "blocked" | "timeout" };

async function resolveAndValidate(hostname: string): Promise<ResolveResult> {
  let addresses: LookupAddress[];
  try {
    addresses = await Promise.race([
      dns.lookup(hostname, { all: true }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("dns timeout")), DNS_TIMEOUT_MS),
      ),
    ]);
  } catch (err) {
    if (err instanceof Error && err.message === "dns timeout") {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "not_found" };
  }
  if (addresses.length === 0) return { ok: false, reason: "not_found" };
  for (const addr of addresses) {
    if (isBlockedIp(addr.address)) {
      return { ok: false, reason: "blocked" };
    }
  }
  return { ok: true, ip: addresses[0].address };
}

function requestOnce(
  targetUrl: URL,
  pinnedIp: string,
): Promise<{ status: number | null; location: string | null }> {
  const client = targetUrl.protocol === "https:" ? https : http;
  return new Promise((resolve) => {
    const req = client.request(
      {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: "GET",
        headers: {
          "User-Agent": "LinkyScanner/1.0 (+https://linky.app; automated link safety check)",
          Accept: "*/*",
        },
        timeout: HOP_TIMEOUT_MS,
        // Pin the connection to the already-validated IP to prevent
        // DNS-rebinding between our check and the actual connection.
        lookup: (_hostname, _options, callback) => {
          callback(null, pinnedIp, pinnedIp.includes(":") ? 6 : 4);
        },
        rejectUnauthorized: true,
      },
      (res) => {
        const status = res.statusCode ?? null;
        const location = (res.headers.location as string | undefined) ?? null;
        res.destroy();
        resolve({ status, location });
      },
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: null, location: null });
    });
    req.on("error", () => {
      resolve({ status: null, location: null });
    });
    req.end();
  });
}

export async function safeFetchChain(initialUrl: string): Promise<SafeFetchResult> {
  const hops: SafeFetchHop[] = [];
  let current: URL;
  try {
    current = new URL(initialUrl);
  } catch {
    return {
      hops,
      finalUrl: initialUrl,
      finalStatus: null,
      blocked: true,
      blockedReason: "Invalid URL",
      error: "Invalid URL",
    };
  }

  for (let i = 0; i < MAX_HOPS; i++) {
    if (current.protocol !== "http:" && current.protocol !== "https:") {
      return {
        hops,
        finalUrl: current.toString(),
        finalStatus: null,
        blocked: true,
        blockedReason: "Unsupported protocol",
        error: null,
      };
    }
    if (!ALLOWED_PORTS.has(current.port)) {
      return {
        hops,
        finalUrl: current.toString(),
        finalStatus: null,
        blocked: true,
        blockedReason: "Non-standard port blocked",
        error: null,
      };
    }

    const resolved = await resolveAndValidate(current.hostname);
    if (!resolved.ok) {
      if (resolved.reason === "blocked") {
        return {
          hops,
          finalUrl: current.toString(),
          finalStatus: null,
          blocked: true,
          blockedReason: "Destination resolves to a non-public address",
          error: null,
        };
      }
      return {
        hops,
        finalUrl: current.toString(),
        finalStatus: null,
        blocked: false,
        blockedReason: null,
        error:
          resolved.reason === "timeout"
            ? "Domain lookup timed out"
            : "This domain could not be found",
      };
    }

    const result = await requestOnce(current, resolved.ip);
    hops.push({ url: current.toString(), status: result.status, location: result.location });

    if (result.status === null) {
      return {
        hops,
        finalUrl: current.toString(),
        finalStatus: null,
        blocked: false,
        blockedReason: null,
        error: "Destination did not respond in time",
      };
    }

    const isRedirect = result.status >= 300 && result.status < 400 && result.location;
    if (!isRedirect) {
      return {
        hops,
        finalUrl: current.toString(),
        finalStatus: result.status,
        blocked: false,
        blockedReason: null,
        error: null,
      };
    }

    try {
      current = new URL(result.location as string, current);
    } catch {
      return {
        hops,
        finalUrl: current.toString(),
        finalStatus: result.status,
        blocked: false,
        blockedReason: null,
        error: "Redirect target could not be parsed",
      };
    }
  }

  return {
    hops,
    finalUrl: current.toString(),
    finalStatus: hops[hops.length - 1]?.status ?? null,
    blocked: false,
    blockedReason: null,
    error: "Too many redirects",
  };
}
