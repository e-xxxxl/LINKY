import type { ReactNode } from "react";

export default function ReportLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-surface-lowest">{children}</div>;
}
