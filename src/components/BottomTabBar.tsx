"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const TABS = [
  { href: "/", label: "Scan", icon: "qr_code_scanner", match: (p: string) => p === "/" },
  { href: "/history", label: "History", icon: "history", match: (p: string) => p.startsWith("/history") },
  { href: "/reviews", label: "Reviews", icon: "rate_review", match: (p: string) => p.startsWith("/reviews") },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed bottom-0 z-50 w-full bg-surface-lowest/90 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[480px] items-center justify-around px-margin-mobile">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-4 transition-colors ${
                active ? "bg-lime text-black" : "text-ink-muted"
              }`}
            >
              <Icon name={tab.icon} size={22} />
              <span className="font-label-sm text-label-sm uppercase tracking-wide">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
