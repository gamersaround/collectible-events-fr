import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getEvents } from "@/lib/queries/events";
import { EventList } from "@/components/events/EventList";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { eventsUrl, eventsBasePath } from "@/lib/paths";
import {
  type CityMatch,
  type CountryMatch,
  citySlug,
  countryPathSlug,
  geoPageCopy,
} from "@/lib/geo-slugs";

interface GeoLandingPageProps {
  locale: string;
  match: CountryMatch | CityMatch;
  relatedCities?: { city: string; country: string }[];
}

export async function GeoLandingPage({
  locale,
  match,
  relatedCities = [],
}: GeoLandingPageProps) {
  const filters =
    match.kind === "country"
      ? { country: match.code }
      : { cities: match.cityNames };
  const eventsRoot = eventsBasePath(locale);
  const { data: events, total } = await getEvents(filters, 1, 24);
  const { title, description } = geoPageCopy(locale, match);
  const isFr = locale === "fr";
  const sectionPath = eventsBasePath(locale);
  const pageUrl = eventsUrl(locale, match.canonicalSlug);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      name: title,
      numberOfItems: total,
      itemListElement: events.slice(0, 10).map((event, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: event.title,
        url: eventsUrl(locale, event.slug),
      })),
    },
  };

  const uniqueCities = Array.from(
    new Map(
      relatedCities
        .filter((row) => row.city && citySlug(row.city))
        .map((row) => [citySlug(row.city), row.city])
    ).values()
  ).sort((a, b) => a.localeCompare(b, locale === "en" ? "en" : "fr"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BreadcrumbSchema
        locale={locale}
        eventTitle={match.kind === "country" ? match.label : match.displayName}
        slug={match.canonicalSlug}
        sectionPath={sectionPath}
      />

      <div className="container py-8">
        <Link
          href={eventsRoot}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFr ? "Tous les événements" : "All events"}
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-600 text-lg max-w-2xl">{description}</p>
          {match.kind === "city" && match.countryCode && (
            <p className="mt-3">
              <Link
                href={`${eventsRoot}/${countryPathSlug(match.countryCode, locale)}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {isFr ? "Voir le pays" : "View country"}
              </Link>
            </p>
          )}
        </header>

        {match.kind === "country" && uniqueCities.length > 0 && (
          <nav className="mb-8" aria-label={isFr ? "Villes" : "Cities"}>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {isFr ? "Villes" : "Cities"}
            </p>
            <ul className="flex flex-wrap gap-2">
              {uniqueCities.map((city) => (
                <li key={citySlug(city)}>
                  <Link
                    href={`${eventsRoot}/${citySlug(city)}`}
                    className="inline-block px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <EventList events={events} total={total} />

        {total > 24 && (
          <div className="mt-8 text-center">
            <Link
              href={
                match.kind === "country"
                  ? `${eventsRoot}?pays=${match.code}`
                  : `${eventsRoot}?q=${encodeURIComponent(match.displayName)}`
              }
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            >
              {isFr ? `Voir les ${total} événements →` : `View all ${total} events →`}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
