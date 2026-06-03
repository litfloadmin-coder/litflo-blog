import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://litflo.ai"),
  title: { default: "LitFlo Blog — Research Tools, PhD Productivity & Academic AI", template: "%s | LitFlo Blog" },
  description: "Practical guides on literature review, academic AI tools, and PhD productivity from researchers who use them every day.",
  openGraph: { siteName: "LitFlo", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", site: "@litfloai" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${caveat.variable}`} style={{ background: "#0d1820" }}>
      <body style={{ background: "#0d1820", minHeight: "100vh" }}>{children}</body>
    </html>
  );
}
