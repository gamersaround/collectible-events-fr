import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const emptyPolyfill = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "lib/empty-polyfill.js"
);

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
  webpack(config, { isServer, webpack }) {
    // Next 14 ships next-polyfill-module in every client bundle, ignoring browserslist.
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /next\/dist\/build\/polyfills\/polyfill-module/,
          emptyPolyfill
        )
      );
    }
    return config;
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
      {
        source: "/en/about",
        destination: "/en/a-propos",
      },
      {
        source: "/en/legal",
        destination: "/en/mentions-legales",
      },
      {
        source: "/en/privacy",
        destination: "/en/confidentialite",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
