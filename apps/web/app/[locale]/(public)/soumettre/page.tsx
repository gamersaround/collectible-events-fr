import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SubmissionForm } from "@/components/forms/SubmissionForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "submit" });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const otherLocale = locale === "fr" ? "en" : "fr";
  return {
    title: t("title"),
    description: locale === "fr"
      ? "Organisez un tournoi, une bourse ou une convention de cartes à collectionner ? Soumettez votre événement gratuitement sur CardAgenda."
      : "Organising a tournament, trade fair or convention? Submit your collectible card event for free on CardAgenda.",
    alternates: {
      canonical: `${appUrl}/${locale}/soumettre`,
      languages: {
        [locale]: `${appUrl}/${locale}/soumettre`,
        [otherLocale]: `${appUrl}/${otherLocale}/soumettre`,
        "x-default": `${appUrl}/fr/soumettre`,
      },
    },
  };
}

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "submit" });

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {t("title")}
        </h1>
        <p className="text-gray-600">{t("description")}</p>
      </div>

      <SubmissionForm />
    </div>
  );
}
