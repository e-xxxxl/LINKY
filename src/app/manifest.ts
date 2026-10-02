import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LINKY — Link Safety Scanner",
    short_name: "LINKY",
    description: "Check a link for phishing, fraud and security risks before you open it.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9f9",
    theme_color: "#f9f9f9",
    icons: [
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
