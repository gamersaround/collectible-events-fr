import { sanityServerClient, sanityWriteClient } from "@/lib/sanity/client";

export interface SponsorInquiryInput {
  name: string;
  email: string;
  organization: string;
  message: string;
  locale?: string | null;
}

export interface PendingSponsorInquiry {
  _id: string;
  name: string;
  email: string;
  organization: string;
  message: string;
  locale?: string | null;
  _createdAt: string;
}

export async function createSponsorInquiry(
  data: SponsorInquiryInput,
  ip?: string
): Promise<void> {
  await sanityWriteClient.create({
    _type: "sponsorInquiry",
    name: data.name,
    email: data.email,
    organization: data.organization,
    message: data.message,
    locale: data.locale ?? null,
    submitterIp: ip ?? null,
    digestedAt: null,
  });
}

export async function listPendingSponsorInquiries(): Promise<PendingSponsorInquiry[]> {
  return sanityServerClient.fetch(
    `*[_type == "sponsorInquiry" && !defined(digestedAt)] | order(_createdAt asc) {
      _id, name, email, organization, message, locale, _createdAt
    }`
  );
}

export async function markSponsorInquiriesDigested(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const digestedAt = new Date().toISOString();
  await Promise.all(
    ids.map((id) => sanityWriteClient.patch(id).set({ digestedAt }).commit())
  );
}
