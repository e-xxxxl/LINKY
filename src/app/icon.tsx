import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          borderRadius: 7,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <rect x="8" y="13.5" width="12" height="5" rx="2.5" transform="rotate(-45 8 13.5)" fill="#c6f340" />
          <rect x="12" y="17.5" width="12" height="5" rx="2.5" transform="rotate(-45 12 17.5)" fill="#c6f340" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
