import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei", "gsap", "framer-motion"],
    // Admin photo uploads go through a Server Action; photos can be up to 5MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
  // The old store had separate pages for these; they are now sections of the home page.
  async redirects() {
    return ["about", "faq", "contact", "promotions"].map((id) => ({
      source: `/${id}`,
      destination: `/#${id}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
