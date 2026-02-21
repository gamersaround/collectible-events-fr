import { createHash } from "crypto";

/**
 * Generate a deterministic fingerprint from an event's identifying fields.
 * Format: MD5(normalized_title|city_lower|YYYY-MM-DD)
 *
 * This fingerprint is used as the Sanity document _id prefix, which means
 * createOrReplace handles deduplication automatically — no DB lookups needed.
 */
export function generateFingerprint(
  title: string,
  city: string,
  startsAt: string
): string {
  const normalizedTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  const cityNorm = city.toLowerCase().replace(/[^a-z]/g, "");
  const date = new Date(startsAt).toISOString().slice(0, 10); // YYYY-MM-DD

  const input = `${normalizedTitle}|${cityNorm}|${date}`;
  return createHash("md5").update(input).digest("hex");
}
