/** Ported verbatim (attribute names only converted to JSX casing) from
 * stitch_linky_url_safety_scanner/linky_home/code.html — the decorative
 * shield + magnifying-glass mark under the hero scanner. */
export function HomeIllustration() {
  return (
    <svg className="h-[150px] w-full max-w-[280px] overflow-visible" fill="none" viewBox="0 0 280 150" xmlns="http://www.w3.org/2000/svg">
      <path d="M 40 32 L 44 24 L 48 32 L 56 36 L 48 40 L 44 48 L 40 40 L 32 36 Z" fill="#c6f340" stroke="#1c1b1b" strokeWidth="1.75" />
      <circle cx="240" cy="30" fill="#1c1b1b" r="4.5" />
      <circle cx="36" cy="118" fill="#1c1b1b" r="3.5" />
      <path d="M 232 108 L 235 102 L 238 108 L 244 111 L 238 114 L 235 120 L 232 114 L 226 111 Z" fill="#c6f340" stroke="#1c1b1b" strokeWidth="1.75" />
      <g transform="translate(140, 75)">
        <path
          d="M -50 -10 C -64 -24 -46 -42 -32 -28 L -14 -10 C 0 4 -18 22 -32 8"
          fill="none"
          stroke="#1c1b1b"
          strokeLinecap="round"
          strokeWidth="2.25"
        />
        <path
          d="M -16 6 C -2 -8 16 10 2 24 L -16 42 C -30 56 -48 38 -34 24"
          fill="none"
          stroke="#1c1b1b"
          strokeLinecap="round"
          strokeWidth="2.25"
        />
        <path d="M -24 -24 Q 0 -34 24 -24 Q 28 8 0 34 Q -28 8 -24 -24 Z" fill="#c6f340" stroke="#1c1b1b" strokeWidth="2" />
        <path d="M -15 -18 Q 0 -25 15 -18 Q 18 4 0 22 Q -18 4 -15 -18 Z" fill="#ffffff" stroke="#1c1b1b" strokeWidth="1.75" />
        <path d="M -6 -1 L 0 5 L 8 -5" fill="none" stroke="#1c1b1b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        <circle cx="28" cy="-6" fill="#ffffff" r="22" stroke="#1c1b1b" strokeWidth="2.5" />
        <circle cx="28" cy="-6" fill="#c6f340" opacity="0.35" r="16" />
        <path d="M 44 10 L 62 28" stroke="#1c1b1b" strokeLinecap="round" strokeWidth="4.5" />
        <path d="M 47 13 L 57 23" stroke="#c6f340" strokeLinecap="round" strokeWidth="2" />
        <path d="M 20 -14 A 12 12 0 0 1 36 -14" fill="none" stroke="#1c1b1b" strokeLinecap="round" strokeWidth="1.75" />
      </g>
    </svg>
  );
}
