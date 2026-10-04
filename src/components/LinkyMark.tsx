import { Icon } from "./Icon";

/** Matches the mark actually used in-context across every Stitch screen's
 * header (a black rounded-lg chip with a lime "link" glyph), not the
 * separate standalone wordmark explored in linky_logo/code.html, which
 * never appears on an actual app screen. */
export function LinkyMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg bg-black"
      style={{ width: size, height: size, boxShadow: "2px 2px 0px #1a1c1c" }}
    >
      <Icon name="link" size={Math.round(size * 0.625)} className="text-lime" />
    </div>
  );
}
