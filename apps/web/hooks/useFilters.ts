"use client";

import { useSearchParams } from "next/navigation";
import type { EventFilters } from "@/types/events";
import { parseFiltersFromParams } from "@/lib/utils/filters";

/**
 * Hook: read current URL filters as EventFilters.
 * Client-side only.
 */
export function useFilters(): EventFilters {
  const searchParams = useSearchParams();
  return parseFiltersFromParams(searchParams);
}
