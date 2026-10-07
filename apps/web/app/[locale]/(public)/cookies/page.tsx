import type { Metadata } from "next";
import { generateLegalMetadata, LegalStaticPage } from "@/components/legal/LegalStaticPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLegalMetadata(locale, "cookies");
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalStaticPage locale={locale} page="cookies" />;
}
