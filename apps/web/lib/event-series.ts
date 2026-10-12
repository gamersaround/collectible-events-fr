/** Series key for matching successive editions without recycling slugs. */
export function normalizeEventSeriesKey(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(?:19|20)\d{2}\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export type EditionCandidate = {
  title: string;
  slug: string;
  starts_at: string;
  series_slug?: string | null;
};

/**
 * Pick the best candidate edition from a pre-filtered list.
 *
 * When the GROQ query was parameterised with a non-null seriesSlug, ALL
 * candidates already share that seriesSlug — return the first one.
 * When the query fell back to city/country matching, apply JS title
 * normalisation to filter out unrelated shows in the same city.
 */
export function pickEditionCandidate(
  currentTitle: string,
  currentSeriesSlug: string | null | undefined,
  candidates: EditionCandidate[]
): EditionCandidate | null {
  if (!candidates.length) return null;

  // seriesSlug-based match: GROQ already filtered by seriesSlug, trust it.
  if (currentSeriesSlug) {
    const hit = candidates.find((c) => c.slug);
    return hit ?? null;
  }

  // Legacy fallback: title normalisation.
  const key = normalizeEventSeriesKey(currentTitle);
  if (!key) return null;
  for (const candidate of candidates) {
    if (!candidate.slug) continue;
    if (normalizeEventSeriesKey(candidate.title) === key) {
      return candidate;
    }
  }
  return null;
}

/** @deprecated Use pickEditionCandidate — kept for any callers not yet updated. */
export function pickNextEdition(
  currentTitle: string,
  candidates: EditionCandidate[]
): EditionCandidate | null {
  return pickEditionCandidate(currentTitle, null, candidates);
}

export const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;
