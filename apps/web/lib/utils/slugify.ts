/**
 * Generate a URL-safe French slug from a string.
 * Removes accents, replaces spaces with dashes, lowercases.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "")   // Remove special chars
    .replace(/\s+/g, "-")            // Spaces → dashes
    .replace(/-+/g, "-")             // Collapse multiple dashes
    .replace(/^-|-$/g, "");          // Trim leading/trailing dashes
}

/**
 * Generate a unique event slug: title-city-YYYYMMDD
 */
export function generateEventSlug(
  title: string,
  city: string,
  startsAt: string | Date
): string {
  const date = new Date(startsAt);
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `${slugify(title)}-${slugify(city)}-${dateStr}`;
}

/**
 * Normalize text for fingerprint comparison (deduplication).
 * More aggressive than slugify — removes all punctuation and articles.
 */
export function normalizeForFingerprint(text: string): string {
  const FR_ARTICLES = /\b(le|la|les|un|une|des|du|de|au|aux|en|à|et|ou)\b/g;
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(FR_ARTICLES, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}
