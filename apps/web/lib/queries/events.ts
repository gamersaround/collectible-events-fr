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
  MAP_EVENTS_QUERY,
  DEPARTMENTS_QUERY,
} from "@/lib/sanity/queries";
import type { EventFilters, PaginatedResult } from "@/types/events";

export interface EventRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tcg_types: string[];
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

export interface DepartmentRow {
  code: string;
  name: string;
}

const DEFAULT_PER_PAGE = 24;

function buildQueryParams(filters: EventFilters) {
  return {
    now: new Date().toISOString(),
    tcgTypes:
      filters.tcgTypes && filters.tcgTypes.length > 0 ? filters.tcgTypes : null,
    format: filters.formats && filters.formats.length > 0 ? filters.formats[0] : null,
    dept: filters.departmentCode ?? null,
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

type MapEvent = Pick<
  EventRow,
  | "id"
  | "slug"
  | "title"
  | "city"
  | "latitude"
  | "longitude"
  | "tcg_types"
  | "format"
  | "starts_at"
> & { address: string | null; postal_code: string | null; country: string | null };

async function geocodeCity(
  city: string,
  address?: string | null,
  postalCode?: string | null,
  country?: string | null
): Promise<{ latitude: number; longitude: number } | null> {
  const countryLabel = country && country !== "FR" ? country : "France";
  const query = [address, postalCode, city, countryLabel].filter(Boolean).join(", ");
  const userAgent = process.env.NOMINATIM_USER_AGENT ?? "agenda-cartes/1.0";

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": userAgent, "Accept": "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json() as Array<{ lat: string; lon: string }>;
    if (!data[0]) return null;
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export async function getEventsForMap(): Promise<MapEvent[]> {
  const events = await sanityServerClient.fetch<MapEvent[]>(MAP_EVENTS_QUERY, {
    now: new Date().toISOString(),
  });

  const ungeocoded = (events ?? []).filter((e) => !e.latitude || !e.longitude);

  if (ungeocoded.length > 0) {
    // Geocode missing events sequentially (Nominatim: 1 req/s)
    for (const event of ungeocoded) {
      const geo = await geocodeCity(event.city, event.address, event.postal_code, event.country);
      if (geo) {
        event.latitude = geo.latitude;
        event.longitude = geo.longitude;
        // Persist coordinates back to Sanity so next load is instant
        const { sanityWriteClient } = await import("@/lib/sanity/client");
        sanityWriteClient
          .patch(event.id)
          .set({ latitude: geo.latitude, longitude: geo.longitude })
          .commit()
          .catch(() => {});
      }
      // Respect Nominatim rate limit (1 req/s)
      await new Promise((r) => setTimeout(r, 1100));
    }
  }

  return (events ?? []).filter((e) => e.latitude && e.longitude);
}

export async function getDepartments(): Promise<DepartmentRow[]> {
  return sanityServerClient.fetch<DepartmentRow[]>(DEPARTMENTS_QUERY);
}
