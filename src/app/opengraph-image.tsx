import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f9f9f9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="13.5" width="12" height="5" rx="2.5" transform="rotate(-45 8 13.5)" fill="#c6f340" />
              <rect x="12" y="17.5" width="12" height="5" rx="2.5" transform="rotate(-45 12 17.5)" fill="#c6f340" />
            </svg>
          </div>
          <span style={{ fontSize: 40, fontWeight: 700, color: "#1a1c1c" }}>LINKY</span>
        </div>
        <p style={{ fontSize: 40, color: "#1a1c1c", marginTop: 40, maxWidth: 900, fontWeight: 600 }}>
          Check any link before you click.
        </p>
        <p style={{ fontSize: 24, color: "#444748", marginTop: 16, maxWidth: 800 }}>
          Instant link safety verdicts so you never get tricked by phishing or malicious downloads.
        </p>
      </div>
    ),
    { ...size },
  );
}
