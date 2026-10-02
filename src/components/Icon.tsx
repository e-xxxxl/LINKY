import type { CSSProperties } from "react";

/** Thin wrapper over the Material Symbols Outlined icon font used throughout
 * the Stitch design. `fill` matches the design's filled-star / filled-icon
 * variants (e.g. review stars). */
export function Icon({
  name,
  size = 20,
  className = "",
  fill = false,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size, fontVariationSettings: fill ? "'FILL' 1" : undefined, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
