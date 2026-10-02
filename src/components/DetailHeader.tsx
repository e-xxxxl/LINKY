import Link from "next/link";
import { Icon } from "./Icon";

/** The "stack" header from scan_report_high_risk_2 / scan_report_safe_2:
 * back button + page title, no bottom tab bar on these pages. The source
 * calls history.back(); we link home instead since a shared report link
 * may have no browser history to return to. */
export function DetailHeader({ title }: { title: string }) {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface-lowest/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[480px] items-center justify-between px-margin-mobile">
        <div className="flex items-center gap-space-xs">
          <Link
            href="/"
            aria-label="Back to scanner"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-lg text-black transition-colors hover:bg-surface-low"
          >
            <Icon name="arrow_back" size={24} />
          </Link>
          <h1 className="font-display text-title-md uppercase tracking-tight text-black">{title}</h1>
        </div>
      </div>
    </header>
  );
}
