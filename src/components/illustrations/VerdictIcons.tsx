/** Ported from scan_report_safe_2/code.html. Used for Safe / Low Risk. */
export function ShieldCheckIllustration({ color }: { color: string }) {
  return (
    <div className="relative mb-space-xs flex h-24 w-24 items-center justify-center">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ backgroundColor: "#c6f340" }}
      />
      <svg className="relative h-full w-full" fill="none" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 22L20 16L26 18L20 20L18 26L16 20L10 18L16 16L18 22Z" fill={color} />
        <path d="M78 28L80 23L85 24.5L80 26L78 31L76 26L71 24.5L76 23L78 28Z" fill="#c6f340" />
        <circle cx="76" cy="68" fill={color} r="3" />
        <circle cx="22" cy="62" fill="#1a1c1c" r="2" />
        <path
          d="M48 14L22 23V46C22 62.5 33.2 77.8 48 82C62.8 77.8 74 62.5 74 46V23L48 14Z"
          fill="#f3f3f4"
          stroke="#1a1c1c"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <path
          d="M48 20L28 27V46C28 59.2 36.6 71.4 48 75.2C59.4 71.4 68 59.2 68 46V27L48 20Z"
          fill={color}
          fillOpacity="0.12"
        />
        <path d="M37 47.5L44.5 55L59 39" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      </svg>
    </div>
  );
}

/** Ported from scan_report_high_risk_2/code.html. Used for Suspicious,
 * High Risk and Malicious, `color` carries the risk-specific tint. */
export function BrokenLinkWarningIllustration({ color }: { color: string }) {
  return (
    <div className="relative mb-space-xs flex h-24 w-24 items-center justify-center">
      <svg className="h-full w-full" fill="none" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <path d="M38 30H26C20.4772 30 16 34.4772 16 40V46C16 51.5228 20.4772 56 26 56H38" stroke="#000000" strokeLinecap="round" strokeWidth="4.5" />
        <path d="M58 40H70C75.5228 40 80 44.4772 80 50V56C80 61.5228 75.5228 66 70 66H58" stroke="#000000" strokeLinecap="round" strokeWidth="4.5" />
        <path d="M43 24L40 33" stroke="#000000" strokeLinecap="round" strokeWidth="3.5" />
        <path d="M53 63L50 72" stroke="#000000" strokeLinecap="round" strokeWidth="3.5" />
        <g transform="translate(32, 26)">
          <path d="M16 2L30 27H2L16 2Z" fill={color} />
          <path d="M16 9V17" stroke="#ffffff" strokeLinecap="round" strokeWidth="2.5" />
          <circle cx="16" cy="22" fill="#ffffff" r="1.5" />
        </g>
      </svg>
    </div>
  );
}
