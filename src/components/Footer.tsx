import Link from "next/link";

const X_URL = "https://x.com/eajejohnson";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-3 px-margin-mobile pb-space-md">
      <div className="flex flex-wrap items-center justify-center gap-2 font-display text-label-sm uppercase tracking-wider text-ink-muted">
        <Link href="/about" className="transition-colors hover:text-black">
          About
        </Link>
        <span>·</span>
        <a href={X_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-black">
          X
        </a>
      </div>
      <p className="text-label-sm text-[11px] text-ink-faint">LINKY • Plain English Link Guard</p>
      <p className="text-label-sm text-[11px] text-ink-faint">
        Built by{" "}
        <a
          href={X_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink-muted underline decoration-line underline-offset-2 transition-colors hover:text-black"
        >
          eajejohnson
        </a>
      </p>
    </footer>
  );
}
