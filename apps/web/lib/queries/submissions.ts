import { sanityWriteClient } from "@/lib/sanity/client";

export interface SubmissionInput {
  title: string;
  description?: string | null;
  tcg_types: string[];
  format: string;
  venue_name?: string | null;
  address?: string | null;
  city: string;
  country?: string | null;
  department_code?: string | null;
  postal_code?: string | null;
  starts_at: string;
  ends_at?: string | null;
  entry_fee?: number | null;
  max_participants?: number | null;
  registration_url?: string | null;
  organizer_name?: string | null;
  organizer_contact?: string | null;
  website_url?: string | null;
  honeypot_field?: string;
  submitter_ip?: string | null;
  recaptcha_score?: number | null;
}

export async function createSubmission(
  data: SubmissionInput,
  ip?: string
): Promise<void> {
  await sanityWriteClient.create({
    _type: "submission",
    title: data.title,
    description: data.description ?? null,
    tcgTypes: data.tcg_types,
    format: data.format,
    venueName: data.venue_name ?? null,
    address: data.address ?? null,
    city: data.city,
    country: data.country ?? "FR",
    departmentCode: data.department_code ?? null,
    postalCode: data.postal_code ?? null,
    startsAt: data.starts_at,
    endsAt: data.ends_at ?? null,
    entryFee: data.entry_fee ?? null,
    maxParticipants: data.max_participants ?? null,
    registrationUrl: data.registration_url ?? null,
    organizerName: data.organizer_name ?? null,
    organizerContact: data.organizer_contact ?? null,
    websiteUrl: data.website_url ?? null,
    submitterIp: ip ?? null,
    status: "en_attente",
  });
}
