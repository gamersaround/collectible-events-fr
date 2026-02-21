import { createClient, SanityClient } from "@sanity/client";

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (client) return client;

  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET ?? "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN must be set"
    );
  }

  client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });

  return client;
}

// ── Crawl Run management ────────────────────────────────────────────────────

export async function createCrawlRun(
  sourceId: string,
  sourceName: string
): Promise<string> {
  const sanity = getSanityClient();
  const doc = await sanity.create({
    _type: "crawlRun",
    sourceId,
    sourceName,
    status: "running",
    startedAt: new Date().toISOString(),
  });
  return doc._id;
}

export async function updateCrawlRun(
  runId: string,
  updates: {
    status?: string;
    finishedAt?: string;
    eventsFound?: number;
    eventsCreated?: number;
    eventsUpdated?: number;
    eventsSkipped?: number;
    errorMessage?: string;
  }
): Promise<void> {
  const sanity = getSanityClient();
  try {
    await sanity.patch(runId).set(updates).commit();
  } catch (err) {
    console.error("Failed to update crawl run:", err);
  }
}

// ── Source management ────────────────────────────────────────────────────────

export interface SanitySource {
  _id: string;
  name: string;
  url: string;
  type: string;
  tcgTypes: string[];
  adapterConfig: Record<string, unknown>;
  crawlFrequencyHours: number;
  lastCrawledAt: string | null;
  isActive: boolean;
}

export async function getActiveSources(): Promise<SanitySource[]> {
  const sanity = getSanityClient();
  return sanity.fetch<SanitySource[]>(
    `*[_type == "source" && isActive == true] {
      _id,
      name,
      url,
      type,
      tcgTypes,
      adapterConfig,
      crawlFrequencyHours,
      lastCrawledAt,
      isActive
    }`
  );
}

export async function updateSourceLastCrawled(sourceId: string): Promise<void> {
  const sanity = getSanityClient();
  try {
    await sanity
      .patch(sourceId)
      .set({ lastCrawledAt: new Date().toISOString() })
      .commit();
  } catch (err) {
    console.error("Failed to update source lastCrawledAt:", err);
  }
}

// ── Event upsert ─────────────────────────────────────────────────────────────

export interface SanityEventInput {
  fingerprint: string;
  sourceId: string;
  externalId?: string | null;
  title: string;
  description: string | null;
  city: string;
  address: string | null;
  postalCode: string | null;
  venueName: string | null;
  startsAt: string;
  endsAt: string | null;
  format: string;
  tcgTypes: string[];
  entryFee: number | null;
  maxParticipants: number | null;
  registrationUrl: string | null;
  organizerName: string | null;
  organizerContact: string | null;
  websiteUrl: string | null;
  sourceUrl: string | null;
  departmentCode: string | null;
  latitude: number | null;
  longitude: number | null;
  slug: string;
}

/**
 * Upsert an event using a deterministic _id based on fingerprint.
 * createOrReplace = create if absent, replace if present → automatic deduplication.
 */
export async function upsertEvent(event: SanityEventInput): Promise<void> {
  const sanity = getSanityClient();

  // Deterministic _id — no need for complex deduplication logic
  const id = event.externalId
    ? `event-${event.sourceId}-${event.externalId}`.replace(/[^a-zA-Z0-9_-]/g, "-")
    : `event-${event.fingerprint}`;

  await sanity.createOrReplace({
    _id: id,
    _type: "event",
    title: event.title,
    slug: { _type: "slug", current: event.slug },
    description: event.description,
    tcgTypes: event.tcgTypes,
    format: event.format,
    status: "a_venir",
    venueName: event.venueName,
    address: event.address,
    city: event.city,
    departmentCode: event.departmentCode,
    postalCode: event.postalCode,
    latitude: event.latitude,
    longitude: event.longitude,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    entryFee: event.entryFee,
    maxParticipants: event.maxParticipants,
    registrationUrl: event.registrationUrl,
    organizerName: event.organizerName,
    organizerContact: event.organizerContact,
    websiteUrl: event.websiteUrl,
    sourceId: event.sourceId,
    externalId: event.externalId ?? null,
    sourceUrl: event.sourceUrl,
    fingerprint: event.fingerprint,
  });
}
