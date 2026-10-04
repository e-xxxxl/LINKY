import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LINKY: check any link before you click. Built by eajejohnson.";

const LIME = "#c6f340";
const INK = "#1a1c1c";

export default async function OpengraphImage() {
  const spaceGrotesk = await readFile(path.join(process.cwd(), "src/app/SpaceGrotesk-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          fontFamily: "Space Grotesk",
          background: "#f9f9f9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `4px 4px 0 ${INK}`,
              }}
            >
              <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
                <rect x="8" y="13.5" width="12" height="5" rx="2.5" transform="rotate(-45 8 13.5)" fill={LIME} />
                <rect x="12" y="17.5" width="12" height="5" rx="2.5" transform="rotate(-45 12 17.5)" fill={LIME} />
              </svg>
            </div>
            <span style={{ fontSize: 44, fontWeight: 800, color: "#000000", letterSpacing: -1 }}>LINKY</span>
          </div>
          <div
            style={{
              display: "flex",
              background: LIME,
              border: `3px solid ${INK}`,
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 24,
              fontWeight: 800,
              color: "#161f00",
              boxShadow: `4px 4px 0 ${INK}`,
            }}
          >
            ZERO-RISK CHECKING
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 700, color: "#000000", letterSpacing: -3, lineHeight: 1.02 }}>
            <span>Check any link</span>
            <span>before you click</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                height: 76,
                padding: "0 28px",
                background: "#ffffff",
                border: `3px solid ${INK}`,
                borderRadius: 20,
                fontSize: 30,
                color: "#747878",
                boxShadow: `6px 6px 0 ${INK}`,
              }}
            >
              https://paste-a-link-here.com
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 76,
                padding: "0 40px",
                background: "#000000",
                borderRadius: 20,
                fontSize: 30,
                fontWeight: 800,
                color: "#ffffff",
                boxShadow: `6px 6px 0 ${LIME}`,
              }}
            >
              Scan link
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28, color: INK }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#444748" }}>Built by</span>
            <span style={{ fontWeight: 800 }}>eajejohnson</span>
            <span style={{ color: "#444748" }}>(Emmanuel Ajejohnson)</span>
          </div>
          <span style={{ fontWeight: 700 }}>linky.tekuvo.com.ng</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" }] },
  );
}
