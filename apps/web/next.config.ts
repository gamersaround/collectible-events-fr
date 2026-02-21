import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@agenda-cartes/shared"],
  // Sanity Studio requires this
  // See: https://www.sanity.io/docs/next-js-app-router-live-preview
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
