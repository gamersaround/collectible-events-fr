import type { EventFilters } from "@/types/events";
import type { TCGType, EventFormat } from "@agenda-cartes/shared";

/**
 * Parse URL search params into EventFilters.
 * Usable in both server and client components.
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
    country: get("pays") ?? undefined,
    search: get("q") ?? undefined,
    dateFrom: get("from") ?? undefined,
    dateTo: get("to") ?? undefined,
    freeOnly: get("gratuit") === "1",
  };
}
