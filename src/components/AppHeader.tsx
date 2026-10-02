import Link from "next/link";
import { LinkyMark } from "./LinkyMark";
import { Icon } from "./Icon";

/** The "tab root" header from linky_home / linky_scanning: mark + stacked
 * wordmark on the left, menu + avatar on the right. Fixed to the viewport
 * top with a blurred white backdrop, exactly as exported. */
export function AppHeader() {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface-lowest/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[480px] items-center justify-between px-margin-mobile">
        <Link href="/" className="flex items-center gap-space-sm">
          <LinkyMark size={32} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-title-md uppercase leading-none tracking-tight text-black">
              LINKY
            </span>
            <span className="-mt-0.5 font-display text-label-sm uppercase tracking-widest text-ink-muted text-[9px]">
              Scan
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-space-xs">
          <Link
            href="/about"
            aria-label="About LINKY"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-black transition-colors hover:bg-surface-low"
          >
            <Icon name="menu" size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}
