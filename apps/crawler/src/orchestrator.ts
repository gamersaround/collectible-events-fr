import {
  getActiveSources,
  createCrawlRun,
  updateCrawlRun,
  updateSourceLastCrawled,
  type SanitySource,
} from "./services/sanity.service";
import { processEvents } from "./pipeline/extractor";
import { PokemonAdapter } from "./adapters/pokemon.adapter";
import { MagicAdapter } from "./adapters/magic.adapter";
import { GenericAdapter } from "./adapters/generic.adapter";
import type { BaseAdapter } from "./adapters/base.adapter";

function createAdapter(source: SanitySource): BaseAdapter | null {
  const config = {
    sourceId: source._id,
    sourceName: source.name,
    sourceUrl: source.url,
    adapterConfig: source.adapterConfig ?? {},
    tcgTypes: source.tcgTypes ?? [],
  };

  if (source.tcgTypes.includes("pokemon")) {
    return new PokemonAdapter(config);
  }

  if (source.tcgTypes.includes("magic")) {
    return new MagicAdapter(config);
  }

  return new GenericAdapter(config);
}

export async function crawlSource(sourceId: string): Promise<void> {
  const sources = await getActiveSources();
  const source = sources.find((s) => s._id === sourceId);

  if (!source) {
    console.error(`Source ${sourceId} not found or inactive`);
    return;
  }

  console.log(`\n🕷️ Crawling: ${source.name} (${source.url})`);

  const runId = await createCrawlRun(source._id, source.name);

  try {
    const adapter = createAdapter(source);

    if (!adapter) {
      throw new Error(`No adapter found for source type: ${source.type}`);
    }

    const { events, error: crawlError } = await adapter.crawl();

    console.log(`  Found ${events.length} raw events`);

    if (crawlError) {
      console.warn(`  Crawl warning: ${crawlError}`);
    }

    const appUrl = process.env.WEB_APP_URL ?? "http://localhost:3000";
    const crawlerSecret = process.env.CRAWLER_SECRET;

    const stats = await processEvents(events, {
      sourceId: source._id,
      runId,
      webhookUrl: crawlerSecret
        ? `${appUrl}/api/webhooks/sanity`
        : undefined,
      crawlerSecret,
    });

    console.log(
      `  ✅ Created/Updated: ${stats.created + stats.updated}, Skipped: ${stats.skipped}, Errors: ${stats.errors}`
    );

    await updateCrawlRun(runId, {
      status: stats.errors > 0 ? "partial" : "success",
      finishedAt: new Date().toISOString(),
      eventsFound: stats.found,
      eventsCreated: stats.created,
      eventsUpdated: stats.updated,
      eventsSkipped: stats.skipped,
    });

    await updateSourceLastCrawled(source._id);
  } catch (err) {
    console.error(`  ❌ Crawl failed:`, err);

    await updateCrawlRun(runId, {
      status: "error",
      finishedAt: new Date().toISOString(),
      errorMessage: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function crawlAll(): Promise<void> {
  const sources = await getActiveSources();

  const now = new Date();
  const dueSources = sources.filter((source) => {
    if (!source.lastCrawledAt) return true;

    const lastCrawled = new Date(source.lastCrawledAt);
    const hoursSince = (now.getTime() - lastCrawled.getTime()) / 3600000;
    return hoursSince >= source.crawlFrequencyHours;
  });

  console.log(
    `\n🚀 Starting crawl run — ${dueSources.length}/${sources.length} sources due`
  );

  for (const source of dueSources) {
    await crawlSource(source._id);
  }

  console.log("\n✅ Crawl run complete");
}
