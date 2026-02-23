export function SiteSchemas({ locale }: { locale: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "CardAgenda",
      url: appUrl,
      logo: {
        "@type": "ImageObject",
        url: `${appUrl}/logo.jpg`,
      },
      description:
        locale === "fr"
          ? "Agenda des événements cartes à collectionner en France et Belgique"
          : "Collectible card event calendar for France and Belgium",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: appUrl,
      name: "CardAgenda",
      potentialAction: {
        "@type": "SearchAction",
        target: `${appUrl}/${locale}/evenements?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
