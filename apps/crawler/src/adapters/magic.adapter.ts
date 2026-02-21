import { BaseAdapter, type AdapterConfig, type CrawlResult, type RawEvent } from "./base.adapter";

interface WizardsEvent {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  storeName: string;
  address1?: string;
  city: string;
  postalCode?: string;
  country: string;
  format?: string;
  eventType?: string;
  url?: string;
}

interface WizardsApiResponse {
  events: WizardsEvent[];
  pagination?: { totalPages: number; currentPage: number };
}

/**
 * Adapter for Magic: The Gathering event locator (Wizards of the Coast).
 */
export class MagicAdapter extends BaseAdapter {
  constructor(config: AdapterConfig) {
    super(config);
  }

  async crawl(): Promise<CrawlResult> {
    const events: RawEvent[] = [];
    const apiEndpoint = (this.config.adapterConfig.apiEndpoint as string) ??
      "https://locator.wizards.com/api/locator/locateEvents";

    try {
      // Wizards event locator API
      const params = new URLSearchParams({
        country: "FR",
        radius: "5000",
        // Center of France
        lat: "46.603354",
        lng: "1.888334",
        pageSize: "100",
      });

      const data = await this.fetchJson<WizardsApiResponse>(
        `${apiEndpoint}?${params.toString()}`
      );

      for (const e of data.events ?? []) {
        if (e.country !== "FR" && e.country !== "France") continue;

        events.push({
          title: e.name,
          city: e.city,
          startsAt: e.startDate,
          endsAt: e.endDate ?? null,
          address: e.address1 ?? null,
          postalCode: e.postalCode ?? null,
          venueName: e.storeName,
          format: this.mapFormat(e.format ?? e.eventType),
          tcgTypes: ["magic"],
          sourceUrl: e.url ?? null,
          externalId: e.id,
        });
      }
    } catch (err) {
      console.error("MagicAdapter error:", err);
      return {
        events,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }

    return { events };
  }

  private mapFormat(format?: string): string {
    const f = (format ?? "").toLowerCase();
    if (f.includes("draft") || f.includes("booster")) return "draft";
    if (f.includes("prerelease")) return "prereleases";
    if (f.includes("league")) return "league";
    if (f.includes("championship") || f.includes("regional") || f.includes("grand prix")) return "championship";
    if (f.includes("standard") || f.includes("modern") || f.includes("legacy") || f.includes("pioneer")) return "tournoi";
    return "tournoi";
  }
}
