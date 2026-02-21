import type { EventRow } from "@/lib/queries/events";

export type Event = EventRow;

// Filters for the listing page (synced to URL params)
export interface EventFilters {
  tcgTypes?: string[];
  formats?: string[];
  departmentCode?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  freeOnly?: boolean;
}

// Pagination
export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
