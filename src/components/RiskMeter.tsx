export function RiskMeter({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className="mt-space-md w-full rounded-xl bg-surface-low p-space-sm">
      <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-surface">
        <div className="h-full" style={{ width: "30%", backgroundColor: "#1e8e3e" }} />
        <div className="h-full" style={{ width: "39%", backgroundColor: "#d98a00" }} />
        <div className="h-full" style={{ width: "31%", backgroundColor: "#ba1a1a" }} />
      </div>
      <div className="relative mt-1 h-4 w-full">
        <div
          className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${clamped}%` }}
        >
          <div
            className="h-0 w-0"
            style={{
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderBottom: "5px solid #1a1c1c",
            }}
          />
          <span className="mt-0.5 text-[10px] font-bold leading-none text-ink">{clamped}</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-1 pt-1 text-[11px] text-ink-muted">
        <span>0 Safe</span>
        <span>30 Caution</span>
        <span>70 Malicious</span>
      </div>
    </div>
  );
}
