/** Ported verbatim from stitch_linky_url_safety_scanner/linky_scanning —
 * the concentric dashed rings + scattered marks around a magnifying-glass
 * mark, shown while a scan is in flight. */
export function ScanningIllustration() {
  return (
    <div className="relative mb-space-lg flex h-56 w-56 items-center justify-center">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" fill="none" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <circle className="animate-[spin_18s_linear_infinite] opacity-35" cx="110" cy="110" r="92" stroke="#1c1b1b" strokeDasharray="8 12" strokeLinecap="round" strokeWidth="2" />
        <circle className="animate-[spin_12s_linear_infinite_reverse] opacity-25" cx="110" cy="110" r="74" stroke="#1c1b1b" strokeDasharray="4 8" strokeWidth="1.5" />
        <rect className="animate-bounce" fill="#c6f340" height="10" rx="2.5" stroke="#1c1b1b" strokeWidth="2" style={{ animationDuration: "2.8s" }} width="10" x="24" y="58" />
        <circle cx="188" cy="148" fill="#c6f340" r="5" stroke="#1c1b1b" strokeWidth="2" />
        <rect fill="#1c1b1b" height="7" rx="1.5" width="7" x="174" y="44" />
        <circle cx="48" cy="162" fill="#1c1b1b" r="3.5" />
        <path d="M42 96L44 91L49 89L44 87L42 82L40 87L35 89L40 91L42 96Z" fill="#c6f340" stroke="#1c1b1b" strokeWidth="1.5" />
        <path d="M166 84L168.5 77.5L175 75L168.5 72.5L166 66L163.5 72.5L157 75L163.5 77.5L166 84Z" fill="#1c1b1b" />
      </svg>
      <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-surface-lowest shadow-lg">
        <svg fill="none" height="68" viewBox="0 0 68 68" width="68" xmlns="http://www.w3.org/2000/svg">
          <path d="M26 34C26 29.5817 29.5817 26 34 26H40C44.4183 26 48 29.5817 48 34C48 38.4183 44.4183 42 40 42H34" stroke="#1c1b1b" strokeLinecap="round" strokeWidth="3" />
          <path d="M42 34C42 38.4183 38.4183 42 34 42H28C23.5817 42 20 38.4183 20 34C20 29.5817 23.5817 26 28 26H34" stroke="#1c1b1b" strokeLinecap="round" strokeWidth="3" />
          <circle cx="28" cy="28" fill="#c6f340" fillOpacity="0.35" r="16" stroke="#1c1b1b" strokeWidth="3" />
          <path d="M40 40L54 54" stroke="#1c1b1b" strokeLinecap="round" strokeWidth="4.5" />
          <circle cx="24" cy="24" fill="#1c1b1b" r="2.5" />
        </svg>
      </div>
      <div className="absolute -bottom-2 flex items-center gap-1.5 rounded-full bg-surface-lowest px-3 py-1 shadow-sm">
        <span className="material-symbols-outlined text-[15px] text-ink-muted" aria-hidden="true">
          verified_user
        </span>
        <span className="text-label-sm text-[11px] uppercase tracking-widest text-ink">Sandbox</span>
      </div>
    </div>
  );
}
