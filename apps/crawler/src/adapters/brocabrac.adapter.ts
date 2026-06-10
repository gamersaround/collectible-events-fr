import { BaseAdapter, type AdapterConfig, type CrawlResult, type RawEvent } from "./base.adapter";

interface BrocabracJsonLd {
  "@type": string;
  name: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  location?: {
    name?: string;
    address?: {
      addressLocality?: string;
      streetAddress?: string;
      postalCode?: string;
    };
    geo?: {
      latitude?: number;
      longitude?: number;
    };
  };
}

const DEFAULT_KEYWORDS = [
  // TCG — termes spécifiques (évite "cartes postales", timbres, capsules...)
  "tcg", "jcc", "trading card",
  "pokémon", "pokemon",
  "yu-gi-oh", "yugioh",
  "magic the gathering", "magic: the gathering",
  "lorcana", "one piece", "dragon ball", "flesh and blood",
  "star wars unlimited", "riftbound",
  // Cartes sportives
  "panini", "topps", "upper deck",
  "cartes sportives", "cartes sport",
  "cartes nba", "cartes nfl", "cartes foot",
];

const EXCLUDE_KEYWORDS = [
  "postale", "timbre", "capsule", "monnaie", "billet", "disque",
  "vinyl", "philatélie", "numismatique",
];

export class BrocabracAdapter extends BaseAdapter {
  constructor(config: AdapterConfig) {
    super(config);
  }

  async crawl(): Promise<CrawlResult> {
    const events: RawEvent[] = [];
    const keywords = (this.config.adapterConfig?.keywords as string[] | undefined) ?? DEFAULT_KEYWORDS;
    const excludeKeywords = (this.config.adapterConfig?.excludeKeywords as string[] | undefined) ?? EXCLUDE_KEYWORDS;
    const MAX_PAGES = 15;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = page === 1
        ? this.config.sourceUrl
        : `${this.config.sourceUrl}?p=${page}`;

      let html: string;
      try {
        html = await this.fetchHtml(url);
      } catch {
        break;
      }

      const cheerio = await import("cheerio");
      const $ = cheerio.load(html);

      const evDivs = $("div.ev[data-event-id]");
      if (evDivs.length === 0) break;

      evDivs.each((_, el) => {
        const scriptEl = $(el).find('script[type="application/ld+json"]').first();
        if (!scriptEl.length) return;

        try {
          const data: BrocabracJsonLd = JSON.parse(scriptEl.html() ?? "");
          if (data["@type"] !== "Event") return;

          const title = data.name?.trim();
          if (!title || !data.startDate) return;

          const titleLower = title.toLowerCase();
          if (keywords.length > 0 && !keywords.some((kw) => titleLower.includes(kw.toLowerCase()))) return;
          if (excludeKeywords.some((kw) => titleLower.includes(kw.toLowerCase()))) return;

          const city = data.location?.address?.addressLocality?.trim() ?? "";
          const address = data.location?.name?.trim()
            ?? data.location?.address?.streetAddress?.trim()
            ?? null;
          const postalCode = data.location?.address?.postalCode?.trim() ?? null;
          const sourceUrl = data.url ?? null;

          events.push({
            title,
            city,
            startsAt: data.startDate,
            endsAt: data.endDate ?? null,
            address,
            postalCode,
            tcgTypes: this.config.tcgTypes,
            sourceUrl,
            format: (this.config.adapterConfig?.format as string) ?? "bourse",
          });
        } catch {
          // skip malformed JSON-LD
        }
      });

      // Stop if we're on the last pagination page
      const totalPages = $("nav.pagination span[data-obf]").length;
      if (page >= totalPages || totalPages === 0) break;
    }

    return { events };
  }
}
