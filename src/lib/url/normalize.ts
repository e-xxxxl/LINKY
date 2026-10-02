export interface NormalizeResult {
  ok: boolean;
  url: URL | null;
  normalizedUrl: string | null;
  error: string | null;
}

const MAX_URL_LENGTH = 2048;

export function normalizeUrl(rawInput: string): NormalizeResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return { ok: false, url: null, normalizedUrl: null, error: "Enter a URL to scan." };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    return { ok: false, url: null, normalizedUrl: null, error: "That URL is too long to scan." };
  }

  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, url: null, normalizedUrl: null, error: "That doesn't look like a valid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      url: null,
      normalizedUrl: null,
      error: "LINKY can only scan http and https links.",
    };
  }

  if (!parsed.hostname) {
    return { ok: false, url: null, normalizedUrl: null, error: "That doesn't look like a valid URL." };
  }

  return { ok: true, url: parsed, normalizedUrl: parsed.toString(), error: null };
}
