import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
  async redirects() {
    return [
      {
        source: "/fr/events",
        destination: "/fr/evenements",
        permanent: true,
      },
      {
        source: "/fr/events/:slug",
        destination: "/fr/evenements/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/en/events",
        destination: "/en/evenements",
      },
      {
        source: "/en/events/:slug",
        destination: "/en/evenements/:slug",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
