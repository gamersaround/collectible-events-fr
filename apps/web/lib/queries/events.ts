import { sanityServerClient } from "@/lib/sanity/client";

export interface SanityImage {
  asset: { _ref: string; _type: string };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string | null;
}
import {
  EVENTS_PAGINATED_QUERY,
  EVENTS_COUNT_QUERY,
  EVENT_BY_SLUG_QUERY,
  ALL_EVENT_SLUGS_QUERY,
  EVENT_COUNTRY_CODES_QUERY,
  EVENT_LOCATIONS_QUERY,
  MAP_EVENTS_QUERY,
  FEATURED_EVENTS_QUERY,
} from "@/lib/sanity/queries";
import type { EventFilters, PaginatedResult } from "@/types/events";

export interface EventRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  meta_description_fr: string | null;
  meta_description_en: string | null;
  tcg_types: string[];
  tcg_sports_ratio: number | null;
  primary_tcg_type: string | null;
  format: string;
  status: string;
  venue_name: string | null;
  address: string | null;
  city: string;
  country: string;
  department_code: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  starts_at: string;
  ends_at: string | null;
  entry_fee: number | null;
  max_participants: number | null;
  registration_url: string | null;
  organizer_name: string | null;
  organizer_contact: string | null;
  website_url: string | null;
  source_url: string | null;
  fingerprint: string | null;
  image: SanityImage | null;
}

const DEFAULT_PER_PAGE = 24;

function buildQueryParams(filters: EventFilters) {
  return {
    now: new Date().toISOString(),
    tcgTypes:
      filters.tcgTypes && filters.tcgTypes.length > 0 ? filters.tcgTypes : null,
    format: filters.formats && filters.formats.length > 0 ? filters.formats[0] : null,
    country: filters.country ?? null,
    cities:
      filters.cities && filters.cities.length > 0 ? filters.cities : null,
    q: filters.search ? `${filters.search}*` : null,
    freeOnly: filters.freeOnly ?? false,
  };
}

export async function getEvents(
  filters: EventFilters = {},
  page = 1,
  perPage = DEFAULT_PER_PAGE
): Promise<PaginatedResult<EventRow>> {
  const params = buildQueryParams(filters);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const [data, total] = await Promise.all([
    sanityServerClient.fetch<EventRow[]>(EVENTS_PAGINATED_QUERY, {
      ...params,
      from,
      to,
    }),
    sanityServerClient.fetch<number>(EVENTS_COUNT_QUERY, params),
  ]);

  return {
    data: data ?? [],
    total: total ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((total ?? 0) / perPage),
  };
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  return sanityServerClient.fetch<EventRow | null>(EVENT_BY_SLUG_QUERY, {
    slug,
  });
}

export async function getAllEventSlugs(): Promise<string[]> {
  const slugs = await sanityServerClient.fetch<(string | null)[]>(
    ALL_EVENT_SLUGS_QUERY
  );
  return (slugs ?? []).filter(Boolean) as string[];
}

export type MapEvent = Pick<
  EventRow,
  | "id"
  | "slug"
  | "title"
  | "city"
  | "country"
  | "latitude"
  | "longitude"
  | "tcg_types"
  | "format"
  | "starts_at"
>;

export async function getEventCountryCodes(): Promise<string[]> {
  try {
    const rows = await sanityServerClient.fetch<{ c: string }[]>(EVENT_COUNTRY_CODES_QUERY);
    return Array.from(new Set((rows ?? []).map((r) => r.c).filter(Boolean)));
  } catch {
    return [];
  }
}

export type EventLocation = { city: string; country: string };

export async function getEventLocations(): Promise<EventLocation[]> {
  try {
    const rows = await sanityServerClient.fetch<EventLocation[]>(EVENT_LOCATIONS_QUERY);
    return (rows ?? []).filter((r) => r.city);
  } catch {
    return [];
  }
}

function todayInParis(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function getFeaturedEvents(): Promise<EventRow[]> {
  const today = todayInParis();
  const events = await sanityServerClient.fetch<EventRow[]>(FEATURED_EVENTS_QUERY, {
    today,
  });
  return events ?? [];
}

export async function getEventsForMap(): Promise<MapEvent[]> {
  const events = await sanityServerClient.fetch<MapEvent[]>(MAP_EVENTS_QUERY, {
    now: new Date().toISOString(),
  });
  return events ?? [];
}
