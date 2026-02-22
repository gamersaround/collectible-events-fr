import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agenda-cartes.fr";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio/", "/api/"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
