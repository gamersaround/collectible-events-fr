import { BaseAdapter, type AdapterConfig, type CrawlResult, type RawEvent } from "./base.adapter";

interface GenericSelectorConfig {
  eventList: string;      // CSS selector for event container elements
  title: string;          // CSS selector for title (relative to event container)
  date: string;           // CSS selector for date
  city?: string;          // CSS selector for city
  address?: string;       // CSS selector for address
  link?: string;          // CSS selector for event link (href)
  nextPage?: string;      // CSS selector for "next page" link
  dateFormat?: string;    // Optional: hint for date parsing
}

/**
 * Generic HTML scraping adapter.
 * Uses cheerio to parse HTML with configurable CSS selectors.
 * Suitable for sites without a public API.
 */
export class GenericAdapter extends BaseAdapter {
  constructor(config: AdapterConfig) {
    super(config);
  }

  async crawl(): Promise<CrawlResult> {
    const events: RawEvent[] = [];
    const selectors = this.config.adapterConfig.selectors as GenericSelectorConfig;

    if (!selectors) {
      return { events: [], error: "No selectors configured" };
    }

    let url: string | null = this.config.sourceUrl;
    let pageCount = 0;
    const MAX_PAGES = 20;

    while (url && pageCount < MAX_PAGES) {
      try {
        const html = await this.fetchHtml(url);
        const cheerio = await import("cheerio");
        const $ = cheerio.load(html);

        const containers = $(selectors.eventList);

        if (containers.length === 0) {
          console.warn(`GenericAdapter: No elements found for selector "${selectors.eventList}" on ${url}`);
          break;
        }

        containers.each((_, el) => {
          try {
            const container = $(el);

            const title = container.find(selectors.title).first().text().trim();
            if (!title) return;

            const dateText = container.find(selectors.date).first().text().trim();
            if (!dateText) return;

            let startsAt: string;
            try {
              startsAt = this.parseDate(dateText);
            } catch {
              console.warn(`GenericAdapter: Cannot parse date "${dateText}"`);
              return;
            }

            const city = selectors.city
              ? container.find(selectors.city).first().text().trim() || ""
              : "";

            const address = selectors.address
              ? container.find(selectors.address).first().text().trim() || null
              : null;

            const sourceUrl = selectors.link
              ? this.resolveUrl(
                  container.find(selectors.link).first().attr("href") ?? "",
                  url!
                )
              : null;

            events.push({
              title,
              city,
              startsAt,
              address,
              tcgTypes: this.config.tcgTypes,
              sourceUrl,
              format: "tournoi",
            });
          } catch (err) {
            console.warn("GenericAdapter: Error parsing event:", err);
          }
        });

        // Pagination
        if (selectors.nextPage) {
          const nextHref = $(selectors.nextPage).first().attr("href");
          url = nextHref ? this.resolveUrl(nextHref, url) : null;
        } else {
          url = null;
        }

        pageCount++;
      } catch (err) {
        console.error("GenericAdapter error:", err);
        return {
          events,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    }

    return { events };
  }

  private resolveUrl(href: string, base: string): string {
    if (!href) return base;
    try {
      return new URL(href, base).toString();
    } catch {
      return href;
    }
  }
}
