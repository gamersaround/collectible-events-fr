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
import { getCountryEditorialCopy } from "@/lib/geo-editorial";

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

  // Editorial copy + FAQ for priority country pages
  const editorial =
    match.kind === "country"
      ? getCountryEditorialCopy(match.code, locale)
      : null;

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

  const faqSchema =
    editorial?.faq && editorial.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: editorial.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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

        {/* Editorial intro + FAQ — only for priority country pages */}
        {editorial && (
          <section className="mt-12 border-t border-gray-100 pt-10 max-w-2xl">
            <p className="text-gray-600 leading-relaxed mb-8">{editorial.intro}</p>
            {editorial.faq.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {isFr ? "Questions fréquentes" : "Frequently asked questions"}
                </h2>
                <dl className="space-y-6">
                  {editorial.faq.map((item, i) => (
                    <div key={i}>
                      <dt className="font-semibold text-gray-900 mb-1">{item.q}</dt>
                      <dd className="text-gray-600 leading-relaxed">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
