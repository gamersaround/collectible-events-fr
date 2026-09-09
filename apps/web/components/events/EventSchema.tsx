import { urlFor } from "@/lib/sanity/image";
import type { EventRow } from "@/lib/queries/events";
import { eventsUrl } from "@/lib/paths";

interface EventSchemaProps {
  event: EventRow;
  locale: string;
}

/**
 * JSON-LD Event schema for Google rich snippets.
 * https://schema.org/Event
 */
export function EventSchema({ event, locale }: EventSchemaProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const eventUrl = eventsUrl(locale, event.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description:
      (locale === "en"
        ? event.meta_description_en || event.meta_description_fr
        : event.meta_description_fr || event.meta_description_en) ||
      event.description ||
      undefined,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus:
      event.status === "annule"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: event.entry_fee === 0 || event.entry_fee === null,
    url: eventUrl,
    ...(event.image
      ? {
          image: urlFor(event.image).width(1200).height(630).auto("format").url(),
        }
      : {}),
    location: {
      "@type": "Place",
      name: event.venue_name ?? event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        postalCode: event.postal_code ?? undefined,
        addressCountry: event.country,
        streetAddress: event.address ?? undefined,
      },
      ...(event.latitude && event.longitude
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.latitude,
              longitude: event.longitude,
            },
          }
        : {}),
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer_name ?? "CardAgenda",
      url: event.website_url ?? appUrl,
    },
    performer: {
      "@type": "Organization",
      name: event.organizer_name ?? "CardAgenda",
    },
    ...(event.entry_fee !== null
      ? {
          offers: {
            "@type": "Offer",
            price: event.entry_fee,
            priceCurrency: "EUR",
            url: event.registration_url ?? eventUrl,
            availability:
              event.status === "annule"
                ? "https://schema.org/Discontinued"
                : "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
