import { z } from "zod";
import type { RawEvent } from "../adapters/base.adapter";

const rawEventSchema = z.object({
  title: z.string().min(2).max(300),
  city: z.string().min(1).max(150),
  startsAt: z.string().min(1),
  endsAt: z.string().nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  postalCode: z.string().max(10).nullable().optional(),
  venueName: z.string().max(200).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  format: z.string().nullable().optional(),
  tcgTypes: z.array(z.string()).optional(),
  entryFee: z.number().min(0).max(1000).nullable().optional(),
  maxParticipants: z.number().int().min(1).max(10000).nullable().optional(),
  registrationUrl: z.string().url().nullable().optional(),
  organizerName: z.string().max(200).nullable().optional(),
  organizerContact: z.string().max(200).nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  externalId: z.string().max(500).nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
});

export interface ValidatedEvent extends RawEvent {
  _isValid: true;
}

export function validateEvent(raw: RawEvent): ValidatedEvent | null {
  const result = rawEventSchema.safeParse(raw);

  if (!result.success) {
    console.warn(`Event validation failed for "${raw.title}":`, result.error.flatten());
    return null;
  }

  // Additional business rules
  const startsAt = new Date(raw.startsAt);
  if (isNaN(startsAt.getTime())) {
    console.warn(`Invalid date for event "${raw.title}": ${raw.startsAt}`);
    return null;
  }

  // Ignore events too far in the past (> 1 day)
  const yesterday = new Date(Date.now() - 86400000);
  if (startsAt < yesterday) {
    return null;
  }

  // Ignore events too far in the future (> 2 years)
  const twoYearsLater = new Date(Date.now() + 2 * 365 * 86400000);
  if (startsAt > twoYearsLater) {
    return null;
  }

  return { ...raw, _isValid: true };
}
