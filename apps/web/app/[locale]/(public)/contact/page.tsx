import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { generateLegalMetadata } from "@/components/legal/LegalStaticPage";
import { SponsorForm } from "@/components/forms/SponsorForm";
import { legalPublicUrl } from "@/lib/legal-paths";
import { PUBLISHER } from "@/lib/publisher";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLegalMetadata(locale, "contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const pageUrl = legalPublicUrl(locale, "contact", appUrl);
  const isFr = locale === "fr";

  const legalRows: { label: string; value: string }[] = [
    { label: t("legal.siren"), value: PUBLISHER.siren },
    { label: t("legal.siret"), value: PUBLISHER.siret },
    { label: t("legal.legalForm"), value: isFr ? PUBLISHER.legalFormFr : PUBLISHER.legalFormEn },
    { label: t("legal.vat"), value: PUBLISHER.vat },
    { label: t("legal.rcs"), value: PUBLISHER.rcsNumber },
    {
      label: t("legal.rcsStatus"),
      value: isFr
        ? `Inscrit au ${PUBLISHER.rcsRegistryFr}, le ${PUBLISHER.rcsRegisteredOnFr}`
        : `Registered at the ${PUBLISHER.rcsRegistryEn}, on ${PUBLISHER.rcsRegisteredOnEn}`,
    },
    { label: t("legal.rne"), value: isFr ? PUBLISHER.rneStatusFr : PUBLISHER.rneStatusEn },
    { label: t("legal.capital"), value: PUBLISHER.shareCapital },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: t("title"),
        description: t("metaDescription"),
        url: pageUrl,
        isPartOf: {
          "@type": "WebSite",
          name: "CardAgenda",
          url: appUrl,
        },
        about: { "@id": `${appUrl}/#publisher` },
      },
      {
        "@type": "Organization",
        "@id": `${appUrl}/#publisher`,
        name: PUBLISHER.name,
        legalName: PUBLISHER.name,
        url: appUrl,
        taxID: PUBLISHER.vat,
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "SIREN",
            value: PUBLISHER.sirenDigits,
          },
          {
            "@type": "PropertyValue",
            propertyID: "SIRET",
            value: PUBLISHER.siretDigits,
          },
        ],
      },
    ],
  };

  return (
    <div className="container py-8 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("title")}</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">{t("intro")}</p>

      <section className="mb-10 border-2 border-black bg-[#FFDE03] p-5 shadow-[4px_4px_0_0_#000]">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("submitTitle")}</h2>
        <p className="text-gray-800 mb-4 text-sm leading-relaxed">{t("submitBody")}</p>
        <Link
          href="/soumettre"
          className="inline-flex items-center bg-black text-[#FFDE03] px-5 py-2.5 text-sm font-semibold hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
        >
          {t("submitCta")}
        </Link>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("formTitle")}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{t("formBody")}</p>
        <SponsorForm />
      </section>

      <section className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{t("publisherTitle")}</h2>
        <p className="font-medium text-gray-900 mb-4">{PUBLISHER.name}</p>
        <dl className="grid grid-cols-1 sm:grid-cols-[minmax(10rem,auto)_1fr] gap-x-6 gap-y-2 text-sm">
          {legalRows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-gray-500">{row.label}</dt>
              <dd className="text-gray-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
