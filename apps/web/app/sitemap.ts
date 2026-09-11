import type { MetadataRoute } from "next";
import { sanityServerClient } from "@/lib/sanity/client";
import { routing } from "@/i18n/routing";
import { TCG_LANDING_SLUGS } from "@/lib/tcg-slugs";
import { eventsUrl } from "@/lib/paths";
import {
  citySlug,
  countryPathSlug,
  EUROPE_COUNTRY_CODES,
  matchCountrySlug,
} from "@/lib/geo-slugs";
import { countryCode } from "@/lib/countries";

const locales = routing.locales;

const STATIC_ROUTES = [
  { path: "", changeFrequency: "hourly" as const, priority: 1 },
  { path: "/evenements", changeFrequency: "hourly" as const, priority: 0.9, eventsIndex: true },
  { path: "/articles", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/carte", changeFrequency: "daily" as const, priority: 0.7 },
  { path: "/soumettre", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/sponsoriser", changeFrequency: "monthly" as const, priority: 0.4 },
];

function localePathUrl(locale: string, path: string, eventsIndex?: boolean) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  if (eventsIndex || path === "/evenements") return eventsUrl(locale);
  return `${appUrl}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    STATIC_ROUTES.map((route) => ({
      url: localePathUrl(locale, route.path, "eventsIndex" in route && route.eventsIndex),
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, localePathUrl(l, route.path, "eventsIndex" in route && route.eventsIndex)])
          ),
          "x-default": localePathUrl("fr", route.path, "eventsIndex" in route && route.eventsIndex),
        },
      },
    }))
  );

  const [events, articles, locations] = await Promise.all([
    sanityServerClient.fetch<Array<{ slug: string; updatedAt: string }>>(
      `*[_type == "event" && defined(slug.current)][0...1000] { "slug": slug.current, "updatedAt": _updatedAt }`
    ),
    sanityServerClient.fetch<Array<{ slug: string; updatedAt: string }>>(
      `*[_type == "article" && defined(slug.current)][0...500] { "slug": slug.current, "updatedAt": _updatedAt }`
    ),
    sanityServerClient.fetch<Array<{ city: string; country: string }>>(
      `*[_type == "event" && status in ["a_venir", "en_cours"] && defined(city) && city != ""]{
        city,
        "country": coalesce(country, "FR")
      }`
    ),
  ]);

  const eventPages: MetadataRoute.Sitemap = (events ?? []).flatMap((e) =>
    locales.map((locale) => ({
      url: eventsUrl(locale, e.slug),
      lastModified: new Date(e.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, eventsUrl(l, e.slug)])),
          "x-default": eventsUrl("fr", e.slug),
        },
      },
    }))
  );

  const articleAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const articlePages: MetadataRoute.Sitemap = (articles ?? []).flatMap((a) =>
    locales.map((locale) => ({
      url: `${articleAppUrl}/${locale}/articles/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${articleAppUrl}/${l}/articles/${a.slug}`])),
          "x-default": `${articleAppUrl}/fr/articles/${a.slug}`,
        },
      },
    }))
  );

  const tcgLandingPages: MetadataRoute.Sitemap = TCG_LANDING_SLUGS.flatMap((tcgSlug) =>
    locales.map((locale) => ({
      url: eventsUrl(locale, tcgSlug),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, eventsUrl(l, tcgSlug)])),
          "x-default": eventsUrl("fr", tcgSlug),
        },
      },
    }))
  );

  const countryCodes = Array.from(
    new Set(
      (locations ?? [])
        .map((row) => countryCode(row.country))
        .filter((code) => EUROPE_COUNTRY_CODES.has(code))
    )
  );
  const countryPages: MetadataRoute.Sitemap = countryCodes.flatMap((code) =>
    locales.map((locale) => {
      const slug = countryPathSlug(code, locale);
      const frSlug = countryPathSlug(code, "fr");
      const enSlug = countryPathSlug(code, "en");
      return {
        url: eventsUrl(locale, slug),
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
        alternates: {
          languages: {
            fr: eventsUrl("fr", frSlug),
            en: eventsUrl("en", enSlug),
            "x-default": eventsUrl("fr", frSlug),
          },
        },
      };
    })
  );

  const citySlugs = Array.from(
    new Set(
      (locations ?? [])
        .filter((row) => EUROPE_COUNTRY_CODES.has(countryCode(row.country)))
        .map((row) => citySlug(row.city))
        .filter((s) => s && !matchCountrySlug(s, "fr"))
    )
  );
  const cityPages: MetadataRoute.Sitemap = citySlugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: eventsUrl(locale, slug),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.75,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, eventsUrl(l, slug)])),
          "x-default": eventsUrl("fr", slug),
        },
      },
    }))
  );

  return [
    ...staticPages,
    ...tcgLandingPages,
    ...countryPages,
    ...cityPages,
    ...eventPages,
    ...articlePages,
  ];
}
