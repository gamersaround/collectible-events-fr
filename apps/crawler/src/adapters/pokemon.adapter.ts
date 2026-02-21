import { BaseAdapter, type AdapterConfig, type CrawlResult, type RawEvent } from "./base.adapter";

interface PokemonApiEvent {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  type?: string;
  format?: string;
  url?: string;
  registrationUrl?: string;
}

interface PokemonApiResponse {
  events: PokemonApiEvent[];
  total: number;
}

/**
 * Adapter for Pokémon.com event locator.
 * Uses the internal API endpoint.
 */
export class PokemonAdapter extends BaseAdapter {
  constructor(config: AdapterConfig) {
    super(config);
  }

  async crawl(): Promise<CrawlResult> {
    const events: RawEvent[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        // Pokémon.com internal events API
        const url = new URL("https://www.pokemon.com/fr/evenements-pokemon/recherche");
        url.searchParams.set("page", String(page));
        url.searchParams.set("country", "FR");

        const html = await this.fetchHtml(url.toString());

        // Parse events from HTML using regex patterns
        // (Pokemon.com embeds event data as JSON in the page)
        const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});\s*<\/script>/s);

        if (!jsonMatch) {
          // Try alternative: parse __NEXT_DATA__
          const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.+?)<\/script>/s);
          if (!nextDataMatch) {
            console.warn("PokemonAdapter: Could not find event data in page");
            break;
          }

          try {
            const nextData = JSON.parse(nextDataMatch[1]);
            const rawEvents = nextData?.props?.pageProps?.events ?? [];

            for (const e of rawEvents) {
              if (e.country !== "FR" && e.venue?.country !== "FR") continue;

              events.push({
                title: e.name ?? e.title,
                city: e.venue?.city ?? e.city ?? "",
                startsAt: e.startDate ?? e.start_date,
                endsAt: e.endDate ?? e.end_date ?? null,
                address: e.venue?.address ?? e.address ?? null,
                postalCode: e.venue?.postalCode ?? e.postal_code ?? null,
                venueName: e.venue?.name ?? null,
                format: this.mapFormat(e.type ?? e.format),
                tcgTypes: ["pokemon"],
                registrationUrl: e.registrationUrl ?? e.url ?? null,
                sourceUrl: e.url ?? null,
                externalId: e.id ?? null,
              });
            }

            hasMore = false; // Single page for Next.js apps
          } catch {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }

        page++;
        if (page > 20) break; // Safety limit
      } catch (err) {
        console.error("PokemonAdapter error:", err);
        return {
          events,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    }

    return { events };
  }

  private mapFormat(type?: string): string {
    const t = (type ?? "").toLowerCase();
    if (t.includes("league")) return "league";
    if (t.includes("championship") || t.includes("regional") || t.includes("national")) return "championship";
    if (t.includes("prerelease") || t.includes("release")) return "prereleases";
    if (t.includes("draft")) return "draft";
    return "tournoi";
  }
}
