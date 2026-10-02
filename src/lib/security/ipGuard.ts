// Blocks outbound requests to private, loopback, link-local and other
// non-public IP ranges so LINKY cannot be used to probe internal networks
// or cloud metadata endpoints (SSRF).

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n < 0 || n > 255) return null;
    result = (result << 8) | n;
  }
  return result >>> 0;
}

interface Range {
  base: string;
  bits: number;
}

const IPV4_BLOCKED_RANGES: Range[] = [
  { base: "0.0.0.0", bits: 8 },
  { base: "10.0.0.0", bits: 8 },
  { base: "100.64.0.0", bits: 10 },
  { base: "127.0.0.0", bits: 8 },
  { base: "169.254.0.0", bits: 16 },
  { base: "172.16.0.0", bits: 12 },
  { base: "192.0.0.0", bits: 24 },
  { base: "192.0.2.0", bits: 24 },
  { base: "192.168.0.0", bits: 16 },
  { base: "198.18.0.0", bits: 15 },
  { base: "198.51.100.0", bits: 24 },
  { base: "203.0.113.0", bits: 24 },
  { base: "224.0.0.0", bits: 4 },
  { base: "240.0.0.0", bits: 4 },
];

function isIpv4InRange(ip: string, range: Range): boolean {
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(range.base);
  if (ipInt === null || baseInt === null) return false;
  const mask = range.bits === 0 ? 0 : (~0 << (32 - range.bits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

const IPV6_BLOCKED_PREFIXES = [
  "::1",
  "::",
  "fe80:",
  "fc00:",
  "fd00:",
  "::ffff:127.",
  "::ffff:10.",
  "::ffff:192.168.",
  "64:ff9b::",
];

// Known cloud metadata addresses, blocked explicitly regardless of range.
const METADATA_ADDRESSES = new Set(["169.254.169.254", "100.100.100.200", "fd00:ec2::254"]);

export function isBlockedIp(ip: string): boolean {
  const normalized = ip.trim().toLowerCase();
  if (METADATA_ADDRESSES.has(normalized)) return true;

  if (ip.includes(".") && !ip.includes(":")) {
    return IPV4_BLOCKED_RANGES.some((range) => isIpv4InRange(normalized, range));
  }

  if (ip.includes(":")) {
    return IPV6_BLOCKED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
  }

  return true;
}
