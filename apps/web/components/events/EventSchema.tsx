import type { EventRow } from "@/lib/queries/events";

interface EventSchemaProps {
  event: EventRow;
}

/**
 * JSON-LD Event schema for Google rich snippets.
 * https://schema.org/Event
 */
export function EventSchema({ event }: EventSchemaProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus:
      event.status === "annule"
        ? "https://schema.org/EventCancelled"
        : event.status === "en_cours"
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${appUrl}/evenements/${event.slug}`,
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
    ...(event.organizer_name
      ? {
          organizer: {
            "@type": "Organization",
            name: event.organizer_name,
            url: event.website_url ?? undefined,
          },
        }
      : {}),
    ...(event.entry_fee !== null
      ? {
          offers: {
            "@type": "Offer",
            price: event.entry_fee,
            priceCurrency: "EUR",
            url: event.registration_url ?? undefined,
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
