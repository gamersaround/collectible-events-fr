"use client";

import { useSearchParams } from "next/navigation";
import type { EventFilters } from "@/types/events";
import type { TCGType, EventFormat } from "@agenda-cartes/shared";

/**
 * Parse URL search params into EventFilters.
 * Used by server components via searchParams prop, and client components via useSearchParams.
 */
export function parseFiltersFromParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): EventFilters {
  const get = (key: string): string | null => {
    if (params instanceof URLSearchParams) return params.get(key);
    const v = params[key];
    return Array.isArray(v) ? v[0] ?? null : v ?? null;
  };

  const getAll = (key: string): string[] => {
    if (params instanceof URLSearchParams) return params.getAll(key);
    const v = params[key];
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  return {
    tcgTypes: getAll("tcg") as TCGType[],
    formats: getAll("format") as EventFormat[],
    departmentCode: get("dept") ?? undefined,
    search: get("q") ?? undefined,
    dateFrom: get("from") ?? undefined,
    dateTo: get("to") ?? undefined,
    freeOnly: get("gratuit") === "1",
  };
}

/**
 * Hook: read current URL filters as EventFilters.
 * Client-side only.
 */
export function useFilters(): EventFilters {
  const searchParams = useSearchParams();
  return parseFiltersFromParams(searchParams);
}
