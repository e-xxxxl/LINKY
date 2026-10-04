import { makeRng } from "@/lib/avatar";

const INK = "#1a1c1c";
const BACKGROUNDS = ["#c6f340", "#ffd6e0", "#bde0fe", "#ffe3a3", "#d9c7ff", "#b8f0d4", "#ffc9a8"];
const HEADS = ["#ffe0bd", "#f1c27d", "#c68642", "#8d5524", "#ffd1dc", "#cde7ff", "#d8f5a2", "#e6d4ff"];
const SHIRTS = ["#000000", "#c6f340", "#ba1a1a", "#2a5bd7", "#ffffff", "#d98a00"];

function pick<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length)];
}

const stroke = { stroke: INK, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** A randomly assembled "bubblehead" character. Deterministic for a given
 * seed, so it can be regenerated anywhere from the stored seed alone. */
export function BubbleAvatar({ seed, size = 48 }: { seed: string; size?: number }) {
  const rng = makeRng(`face:${seed}`);
  const bg = pick(rng, BACKGROUNDS);
  const head = pick(rng, HEADS);
  const shirt = pick(rng, SHIRTS);
  const topper = Math.floor(rng() * 6);
  const eyes = Math.floor(rng() * 6);
  const mouth = Math.floor(rng() * 6);
  const blush = rng() > 0.45;
  const freckles = rng() > 0.7;
  const sparkle = rng() > 0.55;
  const earsOut = rng() > 0.5;
  const hat = pick(rng, SHIRTS.filter((c) => c !== "#ffffff"));

  return (
    <span
      className="inline-block shrink-0 overflow-hidden rounded-xl"
      style={{ width: size, height: size, border: `2px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}`, background: bg }}
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%" role="img" aria-label="Randomly generated bubblehead avatar" fill="none">
        {sparkle && <path d="M54 8l1.8 4.2L60 14l-4.2 1.8L54 20l-1.8-4.2L48 14l4.2-1.8L54 8z" fill="#ffffff" {...stroke} strokeWidth={1.2} />}

        {/* body */}
        <ellipse cx="32" cy="65" rx="18" ry="14" fill={shirt} {...stroke} />

        {/* antenna sits behind the head */}
        {topper === 1 && (
          <>
            <path d="M32 11V4" {...stroke} />
            <circle cx="32" cy="4" r="3" fill="#c6f340" {...stroke} />
          </>
        )}
        {topper === 3 && (
          <>
            <circle cx="15" cy="14" r="6" fill={hat} {...stroke} />
            <circle cx="49" cy="14" r="6" fill={hat} {...stroke} />
          </>
        )}
        {earsOut && (
          <>
            <circle cx="11" cy="32" r="4.5" fill={head} {...stroke} />
            <circle cx="53" cy="32" r="4.5" fill={head} {...stroke} />
          </>
        )}

        {/* the big round head */}
        <circle cx="32" cy="30" r="21" fill={head} {...stroke} />

        {topper === 2 && <path d="M27 10q5-8 10 0" {...stroke} />}
        {topper === 4 && (
          <>
            <path d="M12 30a20 20 0 0 1 40 0" {...stroke} strokeWidth={3} />
            <rect x="7" y="26" width="7" height="13" rx="3.5" fill="#c6f340" {...stroke} />
            <rect x="50" y="26" width="7" height="13" rx="3.5" fill="#c6f340" {...stroke} />
          </>
        )}
        {topper === 5 && (
          <>
            <path d="M11.5 25A21 21 0 0 1 52.5 25Q32 29 11.5 25Z" fill={hat} {...stroke} />
            <circle cx="32" cy="7.5" r="3.2" fill="#ffffff" {...stroke} />
          </>
        )}

        {/* eyes */}
        {eyes === 0 && (
          <>
            <circle cx="24.5" cy="30" r="2.6" fill={INK} />
            <circle cx="39.5" cy="30" r="2.6" fill={INK} />
          </>
        )}
        {eyes === 1 && (
          <>
            <circle cx="24.5" cy="29" r="5.2" fill="#ffffff" {...stroke} strokeWidth={1.6} />
            <circle cx="39.5" cy="29" r="5.2" fill="#ffffff" {...stroke} strokeWidth={1.6} />
            <circle cx="25.8" cy="30" r="2.2" fill={INK} />
            <circle cx="38.2" cy="30" r="2.2" fill={INK} />
          </>
        )}
        {eyes === 2 && (
          <>
            <path d="M20 30q4.5 4 9 0" {...stroke} />
            <path d="M35 30q4.5 4 9 0" {...stroke} />
          </>
        )}
        {eyes === 3 && (
          <>
            <path d="M20 31q4.5-6 9 0" {...stroke} />
            <path d="M35 31q4.5-6 9 0" {...stroke} />
          </>
        )}
        {eyes === 4 && (
          <>
            <path d="M21 27l7 7M28 27l-7 7" {...stroke} />
            <path d="M36 27l7 7M43 27l-7 7" {...stroke} />
          </>
        )}
        {eyes === 5 && (
          <>
            <circle cx="24" cy="30" r="6.5" fill="#ffffff" fillOpacity={0.75} {...stroke} strokeWidth={1.8} />
            <circle cx="40" cy="30" r="6.5" fill="#ffffff" fillOpacity={0.75} {...stroke} strokeWidth={1.8} />
            <path d="M30.5 30h3" {...stroke} strokeWidth={1.8} />
            <circle cx="24" cy="30" r="2" fill={INK} />
            <circle cx="40" cy="30" r="2" fill={INK} />
          </>
        )}

        {blush && (
          <>
            <circle cx="17.5" cy="38" r="3" fill="#ff8fa3" opacity={0.6} />
            <circle cx="46.5" cy="38" r="3" fill="#ff8fa3" opacity={0.6} />
          </>
        )}
        {freckles && (
          <>
            <circle cx="28" cy="36" r="0.9" fill={INK} opacity={0.55} />
            <circle cx="31" cy="37.5" r="0.9" fill={INK} opacity={0.55} />
            <circle cx="36" cy="36" r="0.9" fill={INK} opacity={0.55} />
          </>
        )}

        {/* mouth */}
        {mouth === 0 && <path d="M26 40q6 5.5 12 0" {...stroke} />}
        {mouth === 1 && (
          <>
            <ellipse cx="32" cy="42" rx="5" ry="4" fill={INK} {...stroke} strokeWidth={1.5} />
            <ellipse cx="32" cy="44" rx="2.6" ry="1.5" fill="#ff8fa3" />
          </>
        )}
        {mouth === 2 && <path d="M27 42h10" {...stroke} />}
        {mouth === 3 && <path d="M24 39q8 10 16 0Z" fill="#ffffff" {...stroke} strokeWidth={1.6} />}
        {mouth === 4 && <circle cx="32" cy="42" r="2.6" fill={INK} />}
        {mouth === 5 && <path d="M27 42q6 2 11-4" {...stroke} />}
      </svg>
    </span>
  );
}
