import { groq } from "next-sanity";

// Shared projection that maps Sanity camelCase → snake_case for component compatibility
const EVENT_PROJECTION = groq`{
  "id": _id,
  title,
  "slug": slug.current,
  description,
  "tcg_types": tcgTypes,
  "tcg_sports_ratio": tcgSportsRatio,
  format,
  status,
  "venue_name": venueName,
  address,
  city,
  "country": coalesce(country, "FR"),
  "department_code": departmentCode,
  "postal_code": postalCode,
  latitude,
  longitude,
  "starts_at": startsAt,
  "ends_at": endsAt,
  "entry_fee": entryFee,
  "max_participants": maxParticipants,
  "registration_url": registrationUrl,
  "organizer_name": organizerName,
  "organizer_contact": organizerContact,
  "website_url": websiteUrl,
  "source_url": sourceUrl,
  fingerprint,
  "image": image { asset, hotspot, crop, "alt": alt }
}`;

// Listing with filters — all params optional
export const EVENTS_QUERY = groq`
  *[_type == "event"
    && status in ["a_venir", "en_cours"]
    && (!defined(startsAt) || startsAt > $now)
    && (!defined($tcgTypes) || count((tcgTypes[])[@ in $tcgTypes]) > 0)
    && (!defined($format) || format == $format)
    && (!defined($country) || country == $country)
    && (!defined($q) || title match $q || city match $q || description match $q)
    && (!defined($freeOnly) || $freeOnly == false || entryFee == 0 || !defined(entryFee))
  ] | order(startsAt asc)
`;

// Paginated listing
export const EVENTS_PAGINATED_QUERY = groq`
  *[_type == "event"
    && status in ["a_venir", "en_cours"]
    && (!defined(startsAt) || startsAt > $now)
    && (!defined($tcgTypes) || count((tcgTypes[])[@ in $tcgTypes]) > 0)
    && (!defined($format) || format == $format)
    && (!defined($country) || country == $country)
    && (!defined($q) || title match $q || city match $q || description match $q)
    && (!defined($freeOnly) || $freeOnly == false || entryFee == 0 || !defined(entryFee))
  ] | order(startsAt asc) [$from...$to] ${EVENT_PROJECTION}
`;

// Count for pagination
export const EVENTS_COUNT_QUERY = groq`
  count(*[_type == "event"
    && status in ["a_venir", "en_cours"]
    && (!defined(startsAt) || startsAt > $now)
    && (!defined($tcgTypes) || count((tcgTypes[])[@ in $tcgTypes]) > 0)
    && (!defined($format) || format == $format)
    && (!defined($country) || country == $country)
    && (!defined($q) || title match $q || city match $q || description match $q)
    && (!defined($freeOnly) || $freeOnly == false || entryFee == 0 || !defined(entryFee))
  ])
`;

// Event detail by slug
export const EVENT_BY_SLUG_QUERY = groq`
  *[_type == "event" && slug.current == $slug][0] ${EVENT_PROJECTION}
`;

// All slugs for generateStaticParams + sitemap
export const ALL_EVENT_SLUGS_QUERY = groq`
  *[_type == "event" && status in ["a_venir", "en_cours"]].slug.current
`;

// Lightweight projection for the map — only events with coordinates (fast, no geocoding)
export const MAP_EVENTS_QUERY = groq`
  *[_type == "event"
    && status in ["a_venir", "en_cours"]
    && startsAt > $now
    && defined(latitude) && latitude != null
    && defined(longitude) && longitude != null
  ][0...500] {
    "id": _id,
    "slug": slug.current,
    title,
    city,
    "tcg_types": tcgTypes,
    format,
    "starts_at": startsAt,
    latitude,
    longitude
  }
`;

// Pending submissions
export const PENDING_SUBMISSIONS_QUERY = groq`
  *[_type == "submission" && status == "en_attente"] | order(_createdAt asc)
`;
