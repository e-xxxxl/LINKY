import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What LINKY is, how it evaluates links, and what it can't promise.",
};

const SECTIONS = [
  {
    title: "What LINKY checks",
    items: [
      "Domain properties: HTTPS status, IP-based hosts, punycode, extension, and age where available.",
      "URL structure: length, encoding, hidden hosts, shorteners, keywords and lookalike domains.",
      "Redirects: where a link ultimately leads, resolved safely on our servers.",
      "Reputation: known threat-intelligence providers, when configured.",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-space-lg px-margin-mobile pb-space-lg pt-space-md">
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-display text-headline-md tracking-tight text-black">
          Can you trust this link enough to open it?
        </h1>
        <p className="text-body-sm leading-relaxed text-ink-muted">
          That&rsquo;s the one question LINKY is built to answer. Paste a URL and LINKY checks it
          against domain, URL-structure, redirect and reputation signals, then explains what it
          found in plain language.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="rounded-2xl bg-surface-lowest p-space-md shadow-sm">
          <h2 className="font-display text-title-md text-black">{section.title}</h2>
          <ul className="mt-space-sm flex flex-col gap-2.5">
            {section.items.map((item) => (
              <li key={item} className="flex gap-3 text-body-sm leading-relaxed text-ink-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="rounded-2xl bg-near-black p-space-md text-white shadow-sm">
        <h2 className="font-display text-title-md text-white">What LINKY can&rsquo;t promise</h2>
        <p className="mt-space-sm text-body-sm leading-relaxed text-line">
          A result from LINKY is an assessment based on available signals at the time of the scan,
          not a guarantee. A &ldquo;Safe&rdquo; result means no significant risk signals were
          found, not that a site has been verified, endorsed, or will remain safe in the future.
          New and rapidly evolving scams can evade any automated check. Always apply your own
          judgment, especially before entering sensitive information.
        </p>
      </div>

      <div className="rounded-2xl bg-surface-lowest p-space-md shadow-sm">
        <h2 className="font-display text-title-md text-black">How scanning works safely</h2>
        <p className="mt-space-sm text-body-sm leading-relaxed text-ink-muted">
          When LINKY follows redirects, it validates every destination against private, internal
          and reserved network ranges before connecting, and applies timeouts and hop limits. This
          keeps the scanner from being used to probe internal networks or act as an open proxy.
        </p>
      </div>
    </div>
  );
}
