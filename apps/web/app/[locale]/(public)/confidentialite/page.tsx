import type { Metadata } from "next";
import { generateLegalMetadata, LegalStaticPage } from "@/components/legal/LegalStaticPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLegalMetadata(locale, "privacy");
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalStaticPage locale={locale} page="privacy" />;
}
