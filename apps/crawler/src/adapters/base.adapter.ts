/**
 * BaseAdapter — Contract for all crawler adapters.
 *
 * To add a new adapter:
 * 1. Create a new file in adapters/ (e.g., konami.adapter.ts)
 * 2. Extend BaseAdapter and implement the crawl() method
 * 3. Register the adapter in orchestrator.ts
 */

export interface RawEvent {
  title: string;
  city: string;
  startsAt: string;           // ISO 8601 or parseable date string
  endsAt?: string | null;
  address?: string | null;
  postalCode?: string | null;
  venueName?: string | null;
  description?: string | null;
  format?: string | null;
  tcgTypes?: string[];
  entryFee?: number | null;
  maxParticipants?: number | null;
  registrationUrl?: string | null;
  organizerName?: string | null;
  organizerContact?: string | null;
  websiteUrl?: string | null;
  externalId?: string | null;   // Source-specific unique ID
  sourceUrl?: string | null;    // Direct link to event on source
}

export interface AdapterConfig {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  adapterConfig: Record<string, unknown>;
  tcgTypes: string[];
}

export interface CrawlResult {
  events: RawEvent[];
  error?: string;
}

export abstract class BaseAdapter {
  protected config: AdapterConfig;

  constructor(config: AdapterConfig) {
    this.config = config;
  }

  /**
   * Perform the crawl and return raw events.
   * Implementations must handle their own error recovery.
   */
  abstract crawl(): Promise<CrawlResult>;

  /**
   * Helper: fetch HTML with proper headers.
   */
  protected async fetchHtml(url: string, options?: RequestInit): Promise<string> {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AgendaCartesFR/1.0; +https://agenda-cartes.fr)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5",
        ...options?.headers,
      },
      signal: AbortSignal.timeout(30000),
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${url}`);
    }

    return res.text();
  }

  /**
   * Helper: fetch JSON from an API endpoint.
   */
  protected async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "AgendaCartesFR/1.0 (+https://agenda-cartes.fr)",
        ...options?.headers,
      },
      signal: AbortSignal.timeout(15000),
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${url}`);
    }

    return res.json() as Promise<T>;
  }

  /**
   * Helper: parse a date string, returning ISO format.
   * Override in subclasses for custom date parsing.
   */
  protected parseDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Cannot parse date: ${dateStr}`);
    }
    return date.toISOString();
  }
}
