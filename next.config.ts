import type { NextConfig } from "next";

// assetPrefix is needed only in production, where the page is proxied through
// litflo.ai/blog — without it the browser requests /_next/... from litflo.ai
// which doesn't exist. On preview branches, leave it empty so assets load
// from the preview URL itself (avoids 404s for new chunk hashes).
const assetPrefix =
  process.env.VERCEL_ENV === "production"
    ? "https://litflo-blog.vercel.app"
    : "";

// Same logic for the image optimizer endpoint: when proxied via litflo.ai/blog,
// /_next/image requests hit litflo.ai (404). Point them at the blog's own domain.
const imagePath =
  process.env.VERCEL_ENV === "production"
    ? "https://litflo-blog.vercel.app/_next/image"
    : "/_next/image";

const nextConfig: NextConfig = {
  assetPrefix,
  skipTrailingSlashRedirect: true,
  images: {
    path: imagePath,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // Supabase Storage — covers any project subdomain
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "*.supabase.com", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
