import { urlFor } from "@/lib/sanity/image";
import type { EventRow } from "@/lib/queries/events";
import { eventsUrl } from "@/lib/paths";

interface EventSchemaProps {
  event: EventRow;
  locale: string;
}

/** IANA timezone per ISO-2 country code for European countries in the dataset. */
const COUNTRY_TIMEZONE: Record<string, string> = {
  AT: "Europe/Vienna",
  BE: "Europe/Brussels",
  CH: "Europe/Zurich",
  CZ: "Europe/Prague",
  DE: "Europe/Berlin",
  DK: "Europe/Copenhagen",
  EE: "Europe/Tallinn",
  ES: "Europe/Madrid",
  FI: "Europe/Helsinki",
  FR: "Europe/Paris",
  GB: "Europe/London",
  GR: "Europe/Athens",
  HR: "Europe/Zagreb",
  HU: "Europe/Budapest",
  IE: "Europe/Dublin",
  IT: "Europe/Rome",
  MT: "Europe/Malta",
  NL: "Europe/Amsterdam",
  NO: "Europe/Oslo",
  PL: "Europe/Warsaw",
  PT: "Europe/Lisbon",
  RO: "Europe/Bucharest",
  SE: "Europe/Stockholm",
  SI: "Europe/Ljubljana",
  SK: "Europe/Bratislava",
};

/**
 * Attach a timezone offset to a local-naive ISO-8601 date string
 * stored in Sanity (YYYY-MM-DDTHH:mm:ss, no TZ).
 *
 * Interprets the date in the event's country timezone and returns
 * a full ISO string like "2026-11-29T10:00:00+01:00".
 * Falls back to the original string if TZ is unknown or parsing fails.
 */
function localNaiveToTzIso(localNaive: string, country: string): string {
  const tz = COUNTRY_TIMEZONE[country];
  if (!tz) return localNaive;
  try {
    // Parse as UTC first so we have a base Date object without offset confusion.
    // "YYYY-MM-DDTHH:mm:ss" parsed with Date.parse is treated as UTC in modern JS.
    // We then adjust to find what UTC instant corresponds to that local time in `tz`.
    const utcDate = new Date(`${localNaive}Z`); // treat digits as UTC placeholder
    if (isNaN(utcDate.getTime())) return localNaive;

    // Get the UTC offset for `tz` at that approximate moment (DST-aware).
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    // Format the UTC placeholder date in the target timezone
    const parts = formatter.formatToParts(utcDate);
    const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
    // Reconstruct what local time the UTC placeholder corresponds to
    const tzLocal = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
    // Diff tells us the offset between our naive input and what the UTC placeholder
    // looks like in that timezone — but that's not what we want.
    // Instead: we want to find the UTC instant where the local clock shows `localNaive`.
    // The offset at that moment ≈ offset at `utcDate`. Iterate once to refine.
    const naiveMs = utcDate.getTime(); // milliseconds of our "UTC placeholder"
    const tzLocalMs = new Date(`${tzLocal}Z`).getTime(); // ms of TZ display of that placeholder
    const offsetMs = naiveMs - tzLocalMs; // = UTC - local → negate for local → UTC
    const realUtcMs = naiveMs - offsetMs; // UTC instant when local clock shows localNaive
    const realUtc = new Date(realUtcMs);

    // Express offset as +HH:MM or -HH:MM
    const totalOffsetMin = -offsetMs / 60000;
    const sign = totalOffsetMin >= 0 ? "+" : "-";
    const absMin = Math.abs(totalOffsetMin);
    const hh = String(Math.floor(absMin / 60)).padStart(2, "0");
    const mm = String(Math.round(absMin % 60)).padStart(2, "0");

    // Build final ISO with offset
    const [datePart, timePart] = localNaive.split("T");
    return `${datePart}T${timePart}${sign}${hh}:${mm}`;
  } catch {
    return localNaive;
  }
}

/**
 * JSON-LD Event schema for Google rich snippets.
 * https://schema.org/Event
 */
export function EventSchema({ event, locale }: EventSchemaProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const eventUrl = eventsUrl(locale, event.slug);

  // Locale-aware description: visible Sanity text first, meta description as
  // fallback, omit entirely if nothing is available (GSC TOUL-166).
  const description =
    (locale === "en"
      ? event.meta_description_en || event.meta_description_fr
      : event.meta_description_fr || event.meta_description_en) ||
    event.description ||
    undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(description !== undefined ? { description } : {}),
    startDate: localNaiveToTzIso(event.starts_at, event.country),
    ...(event.ends_at
      ? { endDate: localNaiveToTzIso(event.ends_at, event.country) }
      : {}),
    eventStatus:
      event.status === "annule"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
        ...(event.postal_code ? { postalCode: event.postal_code } : {}),
        addressCountry: event.country,
        ...(event.address ? { streetAddress: event.address } : {}),
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
    ...(event.entry_fee === 0
      ? { isAccessibleForFree: true }
      : event.entry_fee !== null
        ? { isAccessibleForFree: false }
        : {}),
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
