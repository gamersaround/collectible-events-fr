import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  type LegalPageKey,
  legalPublicPath,
  legalPublicUrl,
} from "@/lib/legal-paths";
import { PublisherDetails } from "@/components/legal/PublisherDetails";

const PAGE_NAMESPACE: Record<LegalPageKey, string> = {
  about: "aboutPage",
  contact: "contactPage",
  legal: "legalNoticePage",
  privacy: "privacyPage",
  cookies: "cookiesPage",
};

const SCHEMA_TYPE: Record<LegalPageKey, "AboutPage" | "ContactPage" | "WebPage"> = {
  about: "AboutPage",
  contact: "ContactPage",
  legal: "WebPage",
  privacy: "WebPage",
  cookies: "WebPage",
};

type Section = { title?: string; body: string };

export async function generateLegalMetadata(
  locale: string,
  page: LegalPageKey,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: PAGE_NAMESPACE[page] });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const otherLocale = locale === "fr" ? "en" : "fr";
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: legalPublicUrl(locale, page, appUrl),
      languages: {
        fr: legalPublicUrl("fr", page, appUrl),
        en: legalPublicUrl("en", page, appUrl),
        "x-default": legalPublicUrl("fr", page, appUrl),
      },
    },
    openGraph: {
      title: t("title"),
      description: t("metaDescription"),
      url: legalPublicUrl(locale, page, appUrl),
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: otherLocale === "fr" ? "fr_FR" : "en_GB",
    },
  };
}

export async function LegalStaticPage({
  locale,
  page,
}: {
  locale: string;
  page: LegalPageKey;
}) {
  const t = await getTranslations({ locale, namespace: PAGE_NAMESPACE[page] });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const sections = t.raw("sections") as Section[];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[page],
    name: t("title"),
    description: t("metaDescription"),
    url: legalPublicUrl(locale, page, appUrl),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("title")}</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        {sections.map((section, i) => (
          <section key={i}>
            {section.title ? (
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
            ) : null}
            <p className="whitespace-pre-line">{section.body}</p>
          </section>
        ))}
        {page === "legal" ? <PublisherDetails locale={locale} /> : null}
        {page === "legal" || page === "privacy" || page === "cookies" ? (
          <p>
            <Link
              href={legalPublicPath(locale, "contact")}
              className="font-medium text-gray-900 underline underline-offset-2"
            >
              {tf("contact")}
            </Link>
          </p>
        ) : null}
        {page === "cookies" ? (
          <p>
            <Link
              href={legalPublicPath(locale, "privacy")}
              className="font-medium text-gray-900 underline underline-offset-2"
            >
              {tf("privacy")}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
