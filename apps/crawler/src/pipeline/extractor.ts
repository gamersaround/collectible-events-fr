import type { RawEvent } from "../adapters/base.adapter";
import { validateEvent, type ValidatedEvent } from "./validator";
import { normalizeEvent, type NormalizedEvent } from "./normalizer";
import { generateFingerprint } from "./deduplicator";
import { geocode } from "../services/geocoder.service";
import { upsertEvent } from "../services/sanity.service";

interface ProcessingStats {
  found: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
}

interface ExtractorOptions {
  sourceId: string;
  runId: string;
  webhookUrl?: string;
  crawlerSecret?: string;
}

/**
 * Main pipeline: validate → normalize → geocode → upsert (via createOrReplace)
 *
 * Deduplication is now handled by Sanity's createOrReplace with a deterministic
 * _id = `event-${fingerprint}` (or `event-${sourceId}-${externalId}` if available).
 * No DB lookups needed — the upsert IS the deduplication.
 */
export async function processEvents(
  rawEvents: RawEvent[],
  options: ExtractorOptions
): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    found: rawEvents.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  const processedSlugs: string[] = [];

  for (const raw of rawEvents) {
    try {
      // 1. Validate
      const validated: ValidatedEvent | null = validateEvent(raw);
      if (!validated) {
        stats.skipped++;
        continue;
      }

      // 2. Normalize
      const normalized: NormalizedEvent = normalizeEvent(validated);

      // 3. Geocode
      let latitude: number | null = null;
      let longitude: number | null = null;
      let departmentCode = normalized.departmentCode;

      const geoResult = await geocode(
        normalized.address,
        normalized.city,
        normalized.postalCode
      );

      if (geoResult) {
        latitude = geoResult.latitude;
        longitude = geoResult.longitude;
        if (!departmentCode && geoResult.departmentCode) {
          departmentCode = geoResult.departmentCode;
        }
      }

      // 4. Generate fingerprint + slug
      const fingerprint = generateFingerprint(
        normalized.title,
        normalized.city,
        normalized.startsAt
      );

      const slug = generateSlug(normalized.title, normalized.city, normalized.startsAt);

      // 5. Upsert to Sanity (createOrReplace = automatic dedup via deterministic _id)
      await upsertEvent({
        fingerprint,
        sourceId: options.sourceId,
        externalId: normalized.externalId,
        title: normalized.title,
        description: normalized.description,
        city: normalized.city,
        address: normalized.address,
        postalCode: normalized.postalCode,
        venueName: normalized.venueName,
        startsAt: normalized.startsAt,
        endsAt: normalized.endsAt,
        format: normalized.format,
        tcgTypes: normalized.tcgTypes,
        entryFee: normalized.entryFee,
        maxParticipants: normalized.maxParticipants,
        registrationUrl: normalized.registrationUrl,
        organizerName: normalized.organizerName,
        organizerContact: normalized.organizerContact,
        websiteUrl: normalized.websiteUrl,
        sourceUrl: normalized.sourceUrl,
        departmentCode,
        latitude,
        longitude,
        slug,
      });

      // createOrReplace can be either create or update — count as created for stats
      stats.created++;
      processedSlugs.push(slug);
    } catch (err) {
      console.error("Pipeline error for event:", raw.title, err);
      stats.errors++;
    }
  }

  // Trigger ISR revalidation webhook if events were processed
  if (processedSlugs.length > 0 && options.webhookUrl && options.crawlerSecret) {
    try {
      await fetch(options.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${options.crawlerSecret}`,
        },
        body: JSON.stringify({
          slugs: processedSlugs,
          revalidateAll: stats.created > 5,
        }),
      });
    } catch (err) {
      console.warn("Failed to trigger webhook:", err);
    }
  }

  return stats;
}

function generateSlug(title: string, city: string, startsAt: string): string {
  const date = new Date(startsAt);
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  return `${slugify(title)}-${slugify(city)}-${dateStr}`;
}
