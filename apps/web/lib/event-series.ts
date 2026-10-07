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
  starts_at: string;
};

/** First later event in the same city with the same normalised title. */
export function pickNextEdition(
  currentTitle: string,
  candidates: NextEditionCandidate[]
): NextEditionCandidate | null {
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

export const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;
