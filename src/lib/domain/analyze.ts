import { parse } from "tldts";
import net from "node:net";
import type { DomainInfo } from "@/lib/risk/types";
import { lookupDomainAge } from "./rdap";

export async function analyzeDomain(url: URL): Promise<DomainInfo> {
  const hostname = url.hostname;
  const isIpAddress = net.isIP(hostname) !== 0;
  const isPunycode = hostname.includes("xn--");
  const https = url.protocol === "https:";

  if (isIpAddress) {
    return {
      registrableDomain: hostname,
      subdomain: "",
      tld: "",
      isIpAddress: true,
      isPunycode: false,
      https,
      ageDays: null,
      ageAvailable: false,
      registrar: null,
    };
  }

  const parsed = parse(hostname);
  const registrableDomain = parsed.domain ?? hostname;
  const subdomain = parsed.subdomain ?? "";
  const tld = parsed.publicSuffix ?? "";

  const rdap = await lookupDomainAge(registrableDomain);

  return {
    registrableDomain,
    subdomain,
    tld,
    isIpAddress: false,
    isPunycode,
    https,
    ageDays: rdap.ageDays,
    ageAvailable: rdap.available,
    registrar: rdap.registrar,
  };
}
