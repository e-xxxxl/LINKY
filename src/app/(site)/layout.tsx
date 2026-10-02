import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Footer } from "@/components/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AppHeader />
      {/* Source screens are mobile-only (shell-type "mobile_tab"); no
          desktop layout was provided, so >480px we centre the untouched
          mobile design in the viewport rather than inventing a new one. */}
      <main className="mx-auto w-full max-w-[480px] flex-1 pb-20 pt-16">{children}</main>
      <div className="mx-auto w-full max-w-[480px]">
        <Footer />
      </div>
      <BottomTabBar />
    </div>
  );
}
