import { getTranslations } from "next-intl/server";
import { PUBLISHER } from "@/lib/publisher";

export async function PublisherDetails({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "contactPage" });
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

  return (
    <section>
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
  );
}
