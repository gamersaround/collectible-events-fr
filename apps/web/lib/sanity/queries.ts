import { groq } from "next-sanity";

// Shared projection that maps Sanity camelCase → snake_case for component compatibility
const EVENT_PROJECTION = groq`{
  "id": _id,
  title,
  "slug": slug.current,
  description,
  "meta_description_fr": metaDescriptionFr,
  "meta_description_en": metaDescriptionEn,
  "tcg_types": tcgTypes,
  "tcg_sports_ratio": tcgSportsRatio,
  "primary_tcg_type": primaryTcgType,
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

// Listing with filters — all params optional.
// No upper date bound: every future a_venir / en_cours is eligible (pagination only).
export const EVENTS_QUERY = groq`
  *[_type == "event"
    && status in ["a_venir", "en_cours"]
    && (!defined(startsAt) || startsAt > $now)
    && (!defined($tcgTypes) || count((tcgTypes[])[@ in $tcgTypes]) > 0)
    && (!defined($format) || format == $format)
    && (!defined($country) || country == $country)
    && (!defined($cities) || city in $cities)
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
    && (!defined($cities) || city in $cities)
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
    && (!defined($cities) || city in $cities)
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

export const EVENT_COUNTRY_CODES_QUERY = groq`
  *[_type == "event" && status in ["a_venir", "en_cours"] && defined(country)]{ "c": country }
`;

export const EVENT_LOCATIONS_QUERY = groq`
  *[_type == "event" && status in ["a_venir", "en_cours"] && defined(city) && city != ""]{
    city,
    "country": coalesce(country, "FR")
  }
`;

// Lightweight projection for the map — only events with coordinates (fast, no geocoding)
export const FEATURED_EVENTS_QUERY = groq`
  *[_type == "event"
    && featured == true
    && defined(featuredFrom)
    && defined(featuredTo)
    && featuredFrom <= $today
    && featuredTo >= $today
    && status in ["a_venir", "en_cours"]
  ] | order(startsAt asc) [0...6] ${EVENT_PROJECTION}
`;

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
    "country": coalesce(country, "FR"),
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

// ─── Article queries ──────────────────────────────────────────────────────────

// One Sanity `article` doc, localized fields (titleFr/titleEn, bodyFr/bodyEn, meta FR/EN).
// /fr: FR fields, with legacy title/excerpt/body as FR fallback.
// /en: EN fields only — never paste FR copy onto EN.
const ARTICLE_LOCALE_FILTER = groq`($locale != "en" || defined(titleEn))`;

const ARTICLE_PROJECTION = groq`{
  "id": _id,
  "title": select(
    $locale == "en" => titleEn,
    coalesce(titleFr, title)
  ),
  "slug": slug.current,
  "excerpt": select(
    $locale == "en" => metaDescriptionEn,
    coalesce(metaDescriptionFr, excerpt)
  ),
  "meta_description": select(
    $locale == "en" => metaDescriptionEn,
    coalesce(metaDescriptionFr, excerpt)
  ),
  "published_at": publishedAt,
  author,
  category,
  "tcg_types": tcgTypes,
  "cover_image": coverImage { asset, hotspot, crop, "alt": alt },
  "has_en": defined(titleEn)
}`;

const ARTICLE_DETAIL_PROJECTION = groq`{
  "id": _id,
  "title": select(
    $locale == "en" => titleEn,
    coalesce(titleFr, title)
  ),
  "slug": slug.current,
  "excerpt": select(
    $locale == "en" => metaDescriptionEn,
    coalesce(metaDescriptionFr, excerpt)
  ),
  "meta_description": select(
    $locale == "en" => metaDescriptionEn,
    coalesce(metaDescriptionFr, excerpt)
  ),
  "published_at": publishedAt,
  author,
  category,
  "tcg_types": tcgTypes,
  "cover_image": coverImage { asset, hotspot, crop, "alt": alt },
  "has_en": defined(titleEn),
  "body": select(
    $locale == "en" => bodyEn,
    coalesce(bodyFr, body)
  )
}`;

export const ARTICLES_PAGINATED_QUERY = groq`
  *[_type == "article" && ${ARTICLE_LOCALE_FILTER}] | order(publishedAt desc) [$from...$to] ${ARTICLE_PROJECTION}
`;

export const ARTICLES_COUNT_QUERY = groq`
  count(*[_type == "article" && ${ARTICLE_LOCALE_FILTER}])
`;

export const ARTICLE_BY_SLUG_QUERY = groq`
  *[_type == "article" && slug.current == $slug && ${ARTICLE_LOCALE_FILTER}][0] ${ARTICLE_DETAIL_PROJECTION}
`;

export const ALL_ARTICLE_SLUGS_QUERY = groq`
  *[_type == "article" && defined(slug.current)]{
    "slug": slug.current,
    "hasEn": defined(titleEn)
  }
`;

export const RECENT_ARTICLES_QUERY = groq`
  *[_type == "article" && ${ARTICLE_LOCALE_FILTER}] | order(publishedAt desc) [0...3] ${ARTICLE_PROJECTION}
`;
