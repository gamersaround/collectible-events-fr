/**
 * Outbound click attribution. Same params as the CSE importer:
 * utm_source=cardagenda&utm_medium=listing&utm_campaign=event-redirect
 *
 * Does not overwrite an existing utm_source (featured deals, partner links).
 * JSON-LD / schema should keep the raw URL.
 */
export const CARDAGENDA_UTM = {
  utm_source: "cardagenda",
  utm_medium: "listing",
  utm_campaign: "event-redirect",
} as const;

export function withCardagendaUtm(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return url;
    }
    if (parsed.searchParams.has("utm_source")) {
      return url;
    }
    parsed.searchParams.set("utm_source", CARDAGENDA_UTM.utm_source);
    parsed.searchParams.set("utm_medium", CARDAGENDA_UTM.utm_medium);
    parsed.searchParams.set("utm_campaign", CARDAGENDA_UTM.utm_campaign);
    return parsed.toString();
  } catch {
    return url;
  }
}
