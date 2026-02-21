import type { ValidatedEvent } from "./validator";
import { departmentCodeFromPostalCode } from "../services/geocoder.service";

const VALID_TCG_TYPES = new Set([
  "pokemon", "magic", "yugioh", "sports_cards", "one_piece",
  "dragon_ball", "lorcana", "flesh_blood", "autres",
]);

const VALID_FORMATS = new Set([
  "tournoi", "bourse", "convention", "draft", "prereleases",
  "league", "casual", "championship",
]);

export interface NormalizedEvent {
  title: string;
  description: string | null;
  city: string;
  address: string | null;
  postalCode: string | null;
  venueName: string | null;
  startsAt: string;   // ISO 8601
  endsAt: string | null;
  format: string;
  tcgTypes: string[];
  entryFee: number | null;
  maxParticipants: number | null;
  registrationUrl: string | null;
  organizerName: string | null;
  organizerContact: string | null;
  websiteUrl: string | null;
  externalId: string | null;
  sourceUrl: string | null;
  departmentCode: string | null;
}

export function normalizeEvent(event: ValidatedEvent): NormalizedEvent {
  // Normalize title
  const title = event.title
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"');

  // Normalize city
  const city = event.city
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Parse dates to ISO 8601
  const startsAt = new Date(event.startsAt).toISOString();
  const endsAt = event.endsAt ? new Date(event.endsAt).toISOString() : null;

  // Normalize TCG types
  const tcgTypes = (event.tcgTypes ?? [])
    .map((t) => t.toLowerCase().replace(/ /g, "_"))
    .filter((t) => VALID_TCG_TYPES.has(t));

  if (tcgTypes.length === 0) tcgTypes.push("autres");

  // Normalize format
  const format = VALID_FORMATS.has(event.format?.toLowerCase() ?? "")
    ? (event.format?.toLowerCase() ?? "tournoi")
    : "tournoi";

  // Extract department code from postal code
  let departmentCode: string | null = null;
  if (event.postalCode) {
    try {
      departmentCode = departmentCodeFromPostalCode(event.postalCode);
    } catch {
      // Ignore
    }
  }

  return {
    title,
    description: event.description?.trim() || null,
    city,
    address: event.address?.trim() || null,
    postalCode: event.postalCode?.trim() || null,
    venueName: event.venueName?.trim() || null,
    startsAt,
    endsAt,
    format,
    tcgTypes,
    entryFee: event.entryFee ?? null,
    maxParticipants: event.maxParticipants ?? null,
    registrationUrl: event.registrationUrl || null,
    organizerName: event.organizerName?.trim() || null,
    organizerContact: event.organizerContact?.trim() || null,
    websiteUrl: event.websiteUrl || null,
    externalId: event.externalId || null,
    sourceUrl: event.sourceUrl || null,
    departmentCode,
  };
}
