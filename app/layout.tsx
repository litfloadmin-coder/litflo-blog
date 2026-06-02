import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://litflo.ai"),
  title: { default: "LitFlo Blog — Research Tools, PhD Productivity & Academic AI", template: "%s | LitFlo Blog" },
  description: "Practical guides on literature review, academic AI tools, and PhD productivity from researchers who use them every day.",
  openGraph: {
    siteName: "LitFlo",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", site: "@litfloai" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
