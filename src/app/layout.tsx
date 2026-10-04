import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const SITE_NAME = "LINKY";
const SITE_TITLE = "LINKY: Check a Link Before You Click";
const SITE_DESCRIPTION =
  "Scan suspicious links and understand potential phishing, fraud and security risks before opening them. Built by eajejohnson (Emmanuel Ajejohnson).";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | LINKY",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Emmanuel Ajejohnson (eajejohnson)", url: "https://x.com/eajejohnson" }],
  creator: "eajejohnson",
  publisher: "eajejohnson",
  keywords: [
    "link checker",
    "url scanner",
    "phishing link checker",
    "is this link safe",
    "scam link scanner",
    "link safety",
    "LINKY",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: "@eajejohnson",
    creator: "@eajejohnson",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: {
    "@type": "Person",
    name: "Emmanuel Ajejohnson",
    alternateName: "eajejohnson",
    url: "https://x.com/eajejohnson",
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
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
