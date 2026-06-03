import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Load _next/* assets directly from the blog's Vercel URL so styles/JS
  // work correctly when the page is proxied via litflo.ai/blog
  assetPrefix: "https://litflo-blog.vercel.app",
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
