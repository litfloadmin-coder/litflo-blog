import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
