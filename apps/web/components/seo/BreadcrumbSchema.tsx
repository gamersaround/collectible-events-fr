import { eventsBasePath } from "@/lib/paths";

interface BreadcrumbSchemaProps {
  locale: string;
  /** Title of the leaf page (3rd breadcrumb) */
  eventTitle: string;
  /**
   * Full path segment after the section, e.g. "mon-slug" for events
   * or "articles/mon-slug" for articles.
   */
  slug: string;
  /** Display name of the section (2nd breadcrumb). Defaults to "Événements" / "Events". */
  sectionName?: string;
  /** URL path of the section (2nd breadcrumb). Defaults to "/evenements". */
  sectionPath?: string;
}

export function BreadcrumbSchema({
  locale,
  eventTitle,
  slug,
  sectionName,
  sectionPath,
}: BreadcrumbSchemaProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const defaultSectionName =
    sectionName ?? (locale === "fr" ? "Événements" : "Events");
  const resolvedSectionPath = sectionPath ?? eventsBasePath(locale);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "fr" ? "Accueil" : "Home",
        item: `${appUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: defaultSectionName,
        item: `${appUrl}/${locale}${resolvedSectionPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: eventTitle,
        item: `${appUrl}/${locale}${resolvedSectionPath}/${slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
