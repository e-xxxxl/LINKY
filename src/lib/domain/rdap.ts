// Best-effort domain age lookup via the free, keyless RDAP network
// (rdap.org). Not every TLD has an RDAP server, and lookups are skipped
// entirely for IP-address hosts, so this is reported as "Not available"
// whenever a confident answer can't be produced.

export interface RdapResult {
  available: boolean;
  ageDays: number | null;
  registrar: string | null;
}

const RDAP_TIMEOUT_MS = 4000;

export async function lookupDomainAge(registrableDomain: string): Promise<RdapResult> {
  if (!/^[a-z0-9.-]+$/i.test(registrableDomain)) {
    return { available: false, ageDays: null, registrar: null };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RDAP_TIMEOUT_MS);

  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(registrableDomain)}`, {
      signal: controller.signal,
      headers: { Accept: "application/rdap+json" },
    });

    if (!res.ok) {
      return { available: false, ageDays: null, registrar: null };
    }

    const data = (await res.json()) as {
      events?: { eventAction: string; eventDate: string }[];
      entities?: { roles?: string[]; vcardArray?: unknown[]; handle?: string }[];
    };

    const registrationEvent = data.events?.find((e) => e.eventAction === "registration");
    let ageDays: number | null = null;
    if (registrationEvent) {
      const registered = new Date(registrationEvent.eventDate).getTime();
      if (!Number.isNaN(registered)) {
        ageDays = Math.floor((Date.now() - registered) / (1000 * 60 * 60 * 24));
      }
    }

    const registrarEntity = data.entities?.find((e) => e.roles?.includes("registrar"));
    const registrar = registrarEntity?.handle ?? null;

    if (ageDays === null) {
      return { available: false, ageDays: null, registrar };
    }

    return { available: true, ageDays, registrar };
  } catch {
    return { available: false, ageDays: null, registrar: null };
  } finally {
    clearTimeout(timer);
  }
}
