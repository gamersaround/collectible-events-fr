import { sanityServerClient } from "@/lib/sanity/client";
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

export async function getEventsForMap(): Promise<
  Pick<
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
  >[]
> {
  return sanityServerClient.fetch(MAP_EVENTS_QUERY);
}

export async function getDepartments(): Promise<DepartmentRow[]> {
  return sanityServerClient.fetch<DepartmentRow[]>(DEPARTMENTS_QUERY);
}
