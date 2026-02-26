import type { MetadataRoute } from "next";
import { sanityServerClient } from "@/lib/sanity/client";
import { routing } from "@/i18n/routing";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
const locales = routing.locales;

const STATIC_ROUTES = [
  { path: "", changeFrequency: "hourly" as const, priority: 1 },
  { path: "/evenements", changeFrequency: "hourly" as const, priority: 0.9 },
  { path: "/articles", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/carte", changeFrequency: "daily" as const, priority: 0.7 },
  { path: "/soumettre", changeFrequency: "monthly" as const, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    STATIC_ROUTES.map((route) => ({
      url: `${appUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${appUrl}/${l}${route.path}`])),
          "x-default": `${appUrl}/fr${route.path}`,
        },
      },
    }))
  );

  const [events, articles] = await Promise.all([
    sanityServerClient.fetch<Array<{ slug: string; updatedAt: string }>>(
      `*[_type == "event" && defined(slug.current)][0...1000] { "slug": slug.current, "updatedAt": _updatedAt }`
    ),
    sanityServerClient.fetch<Array<{ slug: string; updatedAt: string }>>(
      `*[_type == "article" && defined(slug.current)][0...500] { "slug": slug.current, "updatedAt": _updatedAt }`
    ),
  ]);

  const eventPages: MetadataRoute.Sitemap = (events ?? []).flatMap((e) =>
    locales.map((locale) => ({
      url: `${appUrl}/${locale}/evenements/${e.slug}`,
      lastModified: new Date(e.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${appUrl}/${l}/evenements/${e.slug}`])),
          "x-default": `${appUrl}/fr/evenements/${e.slug}`,
        },
      },
    }))
  );

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).flatMap((a) =>
    locales.map((locale) => ({
      url: `${appUrl}/${locale}/articles/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${appUrl}/${l}/articles/${a.slug}`])),
          "x-default": `${appUrl}/fr/articles/${a.slug}`,
        },
      },
    }))
  );

  return [...staticPages, ...eventPages, ...articlePages];
}
