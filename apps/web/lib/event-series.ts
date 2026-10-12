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

export type NextEditionCandidate = {
  title: string;
  slug: string;
  series_slug: string | null | undefined;
  starts_at: string;
};

/**
 * Pick the nearest later (or earlier) edition in the same series.
 *
 * Priority:
 * 1. seriesSlug exact match (both current and candidate have the same non-empty seriesSlug).
 * 2. Normalized title match (legacy fallback — no seriesSlug on either side).
 *
 * A candidate is never returned when it has a different non-empty seriesSlug
 * than the current event — that would link across distinct series in the same city.
 */
export function pickEditionInSeries(
  currentTitle: string,
  currentSeriesSlug: string | null | undefined,
  candidates: NextEditionCandidate[]
): NextEditionCandidate | null {
  const titleKey = normalizeEventSeriesKey(currentTitle);

  for (const candidate of candidates) {
    if (!candidate.slug) continue;

    // seriesSlug match (explicit, highest confidence)
    if (currentSeriesSlug && candidate.series_slug) {
      if (candidate.series_slug === currentSeriesSlug) return candidate;
      // Different non-empty seriesSlug — definitely a different series; skip.
      continue;
    }

    // Title-normalization fallback (no seriesSlug on either side)
    if (!currentSeriesSlug && !candidate.series_slug && titleKey) {
      if (normalizeEventSeriesKey(candidate.title) === titleKey) return candidate;
    }
  }

  return null;
}

/**
 * Convenience wrapper kept for backward compat — callers that haven't been
 * updated to pass seriesSlug yet. Title-normalization only.
 */
export function pickNextEdition(
  currentTitle: string,
  candidates: Omit<NextEditionCandidate, "series_slug">[]
): NextEditionCandidate | null {
  return pickEditionInSeries(
    currentTitle,
    null,
    candidates.map((c) => ({ ...c, series_slug: null }))
  );
}

export const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;
