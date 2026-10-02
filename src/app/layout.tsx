import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "LINKY — Check a Link Before You Click",
    template: "%s — LINKY",
  },
  description:
    "Scan suspicious links and understand potential phishing, fraud and security risks before opening them.",
  applicationName: "LINKY",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "LINKY — Check a Link Before You Click",
    description:
      "Scan suspicious links and understand potential phishing, fraud and security risks before opening them.",
    type: "website",
    siteName: "LINKY",
  },
  twitter: {
    card: "summary_large_image",
    title: "LINKY — Check a Link Before You Click",
    description:
      "Scan suspicious links and understand potential phishing, fraud and security risks before opening them.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f9f9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
