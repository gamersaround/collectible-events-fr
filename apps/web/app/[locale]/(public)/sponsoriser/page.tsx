import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SponsorForm } from "@/components/forms/SponsorForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sponsor" });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const otherLocale = locale === "fr" ? "en" : "fr";
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${appUrl}/${locale}/sponsoriser`,
      languages: {
        [locale]: `${appUrl}/${locale}/sponsoriser`,
        [otherLocale]: `${appUrl}/${otherLocale}/sponsoriser`,
        "x-default": `${appUrl}/fr/sponsoriser`,
      },
    },
  };
}

export default async function SponsorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sponsor" });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("title"),
    description: t("metaDescription"),
    url: `${appUrl}/${locale}/sponsoriser`,
    isPartOf: {
      "@type": "WebSite",
      name: "CardAgenda",
      url: appUrl,
    },
  };

  return (
    <div className="container py-8 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("title")}</h1>
        <p className="text-gray-600">{t("description")}</p>
      </div>

      <SponsorForm />
    </div>
  );
}
