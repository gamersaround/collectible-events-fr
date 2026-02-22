import type { MetadataRoute } from "next";
import { sanityServerClient } from "@/lib/sanity/client";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agenda-cartes.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${appUrl}/evenements`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${appUrl}/carte`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${appUrl}/soumettre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const events = await sanityServerClient.fetch<Array<{ slug: string; updatedAt: string }>>(
    `*[_type == "event" && defined(slug.current)][0...1000] { "slug": slug.current, "updatedAt": _updatedAt }`
  );

  const eventPages: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${appUrl}/evenements/${e.slug}`,
    lastModified: new Date(e.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...eventPages];
}
