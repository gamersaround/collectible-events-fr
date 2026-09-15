/** Anonymous event likes stored in a first-party cookie. No Sanity, no accounts. */

export const LIKES_COOKIE = "ca_event_likes";
export const LIKES_CHANGED_EVENT = "ca:likes-changed";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 400;
const MAX_IDS = 80;

function isBrowser(): boolean {
  return typeof document !== "undefined";
}

function sanitizeId(id: string): string | null {
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > 200) return null;
  if (/[;,=\s]/.test(trimmed)) return null;
  return trimmed;
}

export function readLikedIds(): string[] {
  if (!isBrowser()) return [];
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LIKES_COOKIE}=`));
  if (!match) return [];
  const raw = decodeURIComponent(match.slice(LIKES_COOKIE.length + 1));
  if (!raw) return [];
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const part of raw.split(",")) {
    const id = sanitizeId(part);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

function writeLikedIds(ids: string[]): void {
  if (!isBrowser()) return;
  const value = encodeURIComponent(ids.join(","));
  document.cookie = `${LIKES_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function isEventLiked(eventId: string): boolean {
  const id = sanitizeId(eventId);
  if (!id) return false;
  return readLikedIds().includes(id);
}

export function toggleEventLike(eventId: string): boolean {
  const id = sanitizeId(eventId);
  if (!id) return false;

  const ids = readLikedIds();
  const index = ids.indexOf(id);
  let liked: boolean;
  if (index >= 0) {
    ids.splice(index, 1);
    liked = false;
  } else {
    ids.push(id);
    while (ids.length > MAX_IDS) ids.shift();
    liked = true;
  }
  writeLikedIds(ids);

  if (isBrowser()) {
    window.dispatchEvent(
      new CustomEvent(LIKES_CHANGED_EVENT, { detail: { eventId: id, liked } })
    );
  }
  return liked;
}
