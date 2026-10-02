import type { ReactNode } from "react";
import Link from "next/link";
import { LinkyMark } from "@/components/LinkyMark";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-line bg-surface-lowest">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-margin-mobile">
          <Link href="/admin" className="flex items-center gap-2">
            <LinkyMark size={28} />
            <span className="font-display text-title-md text-black">LINKY Admin</span>
          </Link>
          <Link href="/" className="text-body-sm text-ink-muted transition-colors hover:text-black">
            Back to site
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
