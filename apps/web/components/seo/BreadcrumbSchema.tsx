interface BreadcrumbSchemaProps {
  locale: string;
  eventTitle: string;
  slug: string;
}

export function BreadcrumbSchema({ locale, eventTitle, slug }: BreadcrumbSchemaProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
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
        name: locale === "fr" ? "Événements" : "Events",
        item: `${appUrl}/${locale}/evenements`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: eventTitle,
        item: `${appUrl}/${locale}/evenements/${slug}`,
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
