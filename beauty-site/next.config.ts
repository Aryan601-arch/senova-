import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product photos are served from the Senova International site.
    remotePatterns: [
      { protocol: "https", hostname: "senovainternational.com", pathname: "/storage/products/**" },
      { protocol: "https", hostname: "www.senovainternational.com", pathname: "/storage/products/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
