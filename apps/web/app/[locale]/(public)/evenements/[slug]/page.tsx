import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Euro,
  Users,
  ExternalLink,
  ArrowLeft,
  Mail,
  Globe,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getEventBySlug, getAllEventSlugs, getEventLocations } from "@/lib/queries/events";
import { countryCode } from "@/lib/countries";
import { urlFor } from "@/lib/sanity/image";
import { EventBadge, FormatBadge } from "@/components/events/EventBadge";
import { EventSchema } from "@/components/events/EventSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import {
  formatEventDateRange,
  formatDateFr,
  formatEntryFee,
} from "@/lib/utils/dates";
import { TCGType, TCG_CONFIG } from "@agenda-cartes/shared";
import { TcgLandingPage } from "@/components/events/TcgLandingPage";
import { GeoLandingPage } from "@/components/events/GeoLandingPage";
import { TCG_SLUG_MAP, TCG_LANDING_SLUGS } from "@/lib/tcg-slugs";
import { eventsUrl, eventsPath, eventsBasePath } from "@/lib/paths";
import {
  citySlug,
  countryPathSlug,
  EUROPE_COUNTRY_CODES,
  geoPageCopy,
  matchCitySlug,
  matchCountrySlug,
} from "@/lib/geo-slugs";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const EventDetailMap = dynamic(
  () => import("@/components/map/EventDetailMap"),
  { ssr: false }
);

export const revalidate = 3600;

export async function generateStaticParams() {
  const [slugs, locations] = await Promise.all([
    getAllEventSlugs(),
    getEventLocations(),
  ]);
  const europeLocations = locations.filter((row) =>
    EUROPE_COUNTRY_CODES.has(countryCode(row.country))
  );
  const countrySlugs = routing.locales.flatMap((locale) =>
    Array.from(
      new Set(
        europeLocations
          .map((row) => countryPathSlug(row.country, locale))
          .filter((s) => s && !(s in TCG_SLUG_MAP))
      )
    )
  );
  const citySlugs = Array.from(
    new Set(
      europeLocations
        .map((row) => citySlug(row.city))
        .filter((s) => s && !(s in TCG_SLUG_MAP) && !matchCountrySlug(s, "fr"))
    )
  );
  const all = Array.from(
    new Set([...slugs, ...TCG_LANDING_SLUGS, ...countrySlugs, ...citySlugs])
  );
  return routing.locales.flatMap((locale) =>
    all.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const otherLocale = locale === "fr" ? "en" : "fr";

  const languageAlts = (frSlug: string, enSlug: string) => ({
    [locale]: eventsUrl(locale, locale === "en" ? enSlug : frSlug),
    [otherLocale]: eventsUrl(otherLocale, otherLocale === "en" ? enSlug : frSlug),
    "x-default": eventsUrl("fr", frSlug),
  });

  // TCG landing page metadata
  if (slug in TCG_SLUG_MAP) {
    const tcgType = TCG_SLUG_MAP[slug];
    const config = TCG_CONFIG[tcgType as TCGType];
    const title = locale === "fr"
      ? `Événements ${config.label} en Europe : tournois, bourses et conventions`
      : `${config.label} events in Europe: tournaments, trade fairs and conventions`;
    const description = locale === "fr"
      ? `Tous les événements ${config.label} en Europe (France, Belgique, Royaume-Uni…) : tournois, bourses, conventions, drafts. Agenda mis à jour quotidiennement.`
      : `All ${config.label} events in Europe (France, Belgium, UK…): tournaments, trade fairs, conventions, drafts. Calendar updated daily.`;
    return {
      title,
      description,
      alternates: {
        canonical: eventsUrl(locale, slug),
        languages: languageAlts(slug, slug),
      },
      openGraph: { title, description, type: "website" },
    };
  }

  const country = matchCountrySlug(slug, locale);
  if (country) {
    const { title, description } = geoPageCopy(locale, country);
    return {
      title,
      description,
      alternates: {
        canonical: eventsUrl(locale, country.canonicalSlug),
        languages: languageAlts(country.slugFr, country.slugEn),
      },
      openGraph: { title, description, type: "website" },
    };
  }

  const locations = await getEventLocations();
  const city = matchCitySlug(slug, locations);
  if (city) {
    const { title, description } = geoPageCopy(locale, city);
    return {
      title,
      description,
      alternates: {
        canonical: eventsUrl(locale, city.canonicalSlug),
        languages: languageAlts(city.canonicalSlug, city.canonicalSlug),
      },
      openGraph: { title, description, type: "website" },
    };
  }

  const t = await getTranslations({ locale, namespace: "eventDetail" });
  const event = await getEventBySlug(slug);

  if (!event) return { title: t("notFound") };

  const dateLocale = locale as "fr" | "en";
  const fallback = `${event.title} : ${event.city}, ${formatDateFr(event.starts_at, "EEEE d MMMM yyyy", dateLocale)}`;
  const description =
    (locale === "en"
      ? event.meta_description_en || event.meta_description_fr
      : event.meta_description_fr || event.meta_description_en) ||
    event.description ||
    fallback;
  return {
    title: event.title,
    description,
    alternates: {
      canonical: eventsUrl(locale, slug),
      languages: languageAlts(slug, slug),
    },
    openGraph: {
      title: event.title,
      description,
      type: "website",
      images: event.image
        ? [{ url: urlFor(event.image).width(1200).height(630).auto("format").url() }]
        : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // TCG landing pages: /fr/evenements/pokemon, /en/events/magic, etc.
  if (slug in TCG_SLUG_MAP) {
    return <TcgLandingPage tcgType={TCG_SLUG_MAP[slug]} locale={locale} urlSlug={slug} />;
  }

  const country = matchCountrySlug(slug, locale);
  if (country) {
    if (slug !== country.canonicalSlug) {
      redirect(eventsPath(locale, country.canonicalSlug));
    }
    const locations = await getEventLocations();
    const relatedCities = locations.filter(
      (row) => countryCode(row.country) === country.code
    );
    return (
      <GeoLandingPage
        locale={locale}
        match={country}
        relatedCities={relatedCities}
      />
    );
  }

  const locations = await getEventLocations();
  const city = matchCitySlug(slug, locations);
  if (city) {
    return <GeoLandingPage locale={locale} match={city} />;
  }

  const t = await getTranslations({ locale, namespace: "eventDetail" });
  const tc = await getTranslations({ locale, namespace: "countries" });
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const isCancelled = event.status === "annule";
  const dateLocale = locale as "fr" | "en";
  const freeLabel = locale === "fr" ? "Gratuit" : "Free";
  const code = countryCode(event.country);
  const countryLabel = tc.has(code) ? tc(code) : code;

  return (
    <>
      <EventSchema event={event} locale={locale} />
      <BreadcrumbSchema locale={locale} eventTitle={event.title} slug={slug} />

      <div className="container py-8 max-w-4xl">
        {/* Back link */}
        <Link
          href={eventsBasePath(locale)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backLink")}
        </Link>

        {/* Hero image */}
        {event.image && (
          <div className="relative h-56 md:h-80 w-full rounded-xl overflow-hidden border-2 border-black mb-8">
            <Image
              src={urlFor(event.image).width(1200).height(400).auto("format").url()}
              alt={event.image.alt ?? event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <article>
          {/* Header */}
          <header className="mb-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tcg_types.map((tcg) => (
                <EventBadge key={tcg} tcgType={tcg as TCGType} />
              ))}
              <FormatBadge format={event.format} />
              {isCancelled && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                  {t("cancelled")}
                </span>
              )}
            </div>

            <h1 className={`text-3xl font-bold text-gray-900 mb-3 ${isCancelled ? "line-through opacity-60" : ""}`}>
              {event.title}
            </h1>

            {event.description && (
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            )}
          </header>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date & time */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                <Calendar className="h-5 w-5" />
                {t("dateTitle")}
              </div>
              <p className="text-gray-900 font-medium">
                {formatEventDateRange(event.starts_at, event.ends_at, dateLocale)}
              </p>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                <MapPin className="h-5 w-5" />
                {t("locationTitle")}
              </div>
              {event.venue_name && (
                <p className="font-medium text-gray-900">{event.venue_name}</p>
              )}
              {event.address && (
                <p className="text-gray-600 text-sm">{event.address}</p>
              )}
              <p className="text-gray-700">
                {event.postal_code && `${event.postal_code} `}
                <span className="font-medium">{event.city}</span>
              </p>
              <p className="text-gray-600 text-sm mt-0.5">{countryLabel}</p>
              {event.latitude && event.longitude && (
                <>
                  <EventDetailMap
                    latitude={event.latitude}
                    longitude={event.longitude}
                    venueName={event.venue_name}
                    address={event.address}
                    city={event.city}
                    countryLabel={countryLabel}
                  />
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline"
                  >
                    {t("viewOnMap")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </>
              )}
            </div>

            {/* Entry fee */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                <Euro className="h-5 w-5" />
                {t("priceTitle")}
              </div>
              <p className={`font-medium text-lg ${event.entry_fee === null || event.entry_fee === 0 ? "text-green-600" : "text-gray-900"}`}>
                {formatEntryFee(event.entry_fee, freeLabel)}
              </p>
              {event.max_participants && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                  <Users className="h-4 w-4" />
                  {t("maxParticipants", { count: event.max_participants })}
                </p>
              )}
            </div>

            {/* Organizer */}
            {(event.organizer_name || event.organizer_contact || event.website_url) && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                  <Users className="h-5 w-5" />
                  {t("organizerTitle")}
                </div>
                {event.organizer_name && (
                  <p className="font-medium text-gray-900">{event.organizer_name}</p>
                )}
                {event.organizer_contact && (
                  <a
                    href={`mailto:${event.organizer_contact}`}
                    className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {event.organizer_contact}
                  </a>
                )}
                {event.website_url && (
                  <a
                    href={event.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {t("website")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Registration CTA */}
          {event.registration_url && !isCancelled && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <h2 className="font-semibold text-blue-900 mb-2">{t("registrationTitle")}</h2>
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t("register")}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Source attribution */}
          {event.source_url && (
            <div className="mt-6 text-center text-sm text-gray-400">
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600"
              >
                {t("originalSource")}
              </a>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
