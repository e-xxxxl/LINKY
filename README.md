# LINKY — Link Safety & Fraud Scanner

LINKY checks a URL against domain, URL-structure, redirect and reputation signals and explains
the result in plain language. It never claims to guarantee that a site is safe.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Prisma + SQLite (swap the `provider` in `prisma/schema.prisma` to `postgresql` for production)
- Zod for request validation
- A minimal manual service worker for offline/PWA support (no external PWA library)

## Getting started

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open http://localhost:3000.

## Environment variables

See `.env.example`. Everything except `DATABASE_URL` is optional:

- `ADMIN_PASSWORD` / `SESSION_SECRET` — required to sign in at `/admin`.
- `GOOGLE_SAFE_BROWSING_API_KEY`, `VIRUSTOTAL_API_KEY` — reputation providers. Without a key, LINKY
  clearly reports that provider as "Not available" rather than fabricating a result.
- `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS` — in-memory rate limiting per client IP.

## Architecture

```
src/lib/
  url/          normalize + structural URL signals
  domain/       registrable-domain parsing, punycode/IP checks, RDAP domain age lookup
  security/     SSRF-safe outbound fetch (IP-range blocking, DNS-rebinding-safe pinning)
  reputation/   Google Safe Browsing + VirusTotal clients (graceful "not available" fallback)
  risk/         signal types, scoring weights, the risk engine that ties it all together
```

`runScan()` in `src/lib/risk/engine.ts` is the single entry point: it runs domain analysis,
redirect resolution and reputation checks in parallel, combines every signal into a weighted
score (0–100), maps that score to a risk level (Safe / Low Risk / Suspicious / High Risk /
Malicious), and produces a short human-readable "why" list from the highest-weighted signals.

## Security notes

- All outbound redirect-following happens server-side through `safeFetchChain`, which resolves
  DNS itself, rejects private/loopback/link-local/reserved/metadata IP ranges, and pins the
  connection to the validated IP (mitigating DNS rebinding) rather than trusting a second DNS
  lookup at connect time.
- Only ports 80/443 and the `http`/`https` schemes are allowed outbound.
- Scanning and review submission are both rate-limited per client IP.
- The admin session is a signed, expiring cookie (HMAC-SHA256 with `SESSION_SECRET`), not a
  database-backed session, since there is a single admin role.
- Anonymous scan history is tied to a random session cookie, not an account — no personal data is
  collected to show a visitor their own history.

## Known limitations

- The rate limiter is in-memory and per-instance; a multi-instance deployment needs a shared store
  (e.g. Redis) instead.
- Domain age comes from the free, keyless RDAP network (`rdap.org`) and is best-effort — not every
  TLD has an RDAP server, in which case age is reported as "Not available" rather than guessed.
- Reputation checks depend on external provider keys. Without them, LINKY says so rather than
  inventing a verdict.
- The three review-wall entries seeded by `prisma/seed.ts` are demo content, visibly labeled
  "Demo content" in the UI, and are never presented as real user submissions.
