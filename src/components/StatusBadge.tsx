import type { RiskLevel } from "@/lib/risk/types";
import { RISK_LEVEL_LABEL } from "@/lib/format";
import { RISK_COLOR } from "@/lib/riskColor";

/** Compact risk indicator for tables/lists (History, Admin). The report
 * page itself uses its own bespoke verdict treatment, not this. */
export function StatusBadge({ level }: { level: RiskLevel }) {
  const color = RISK_COLOR[level];

  return (
    <span className="inline-flex items-center gap-1.5 text-body-sm font-semibold" style={{ color }}>
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {RISK_LEVEL_LABEL[level]}
    </span>
  );
}
