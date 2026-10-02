import type { ReactNode } from "react";

/** The lime eyebrow pill used above every home-page section ("How it
 * works", "Reviews") and standalone ("Zero-risk checking"). */
export function SectionPill({ children, large = false }: { children: ReactNode; large?: boolean }) {
  return (
    <div
      className={`inline-flex self-start items-center rounded-md bg-lime ${large ? "px-2.5 py-1 rounded-full" : "px-2 py-0.5"}`}
      style={{ boxShadow: "2px 2px 0px #1c1b1b" }}
    >
      <span className="font-display text-label-sm uppercase tracking-wider text-lime-ink">{children}</span>
    </div>
  );
}
