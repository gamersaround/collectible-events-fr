/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@agenda-cartes/shared"],
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
