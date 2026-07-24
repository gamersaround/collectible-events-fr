import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { TCG_CONFIG, TCGType } from "@agenda-cartes/shared";
import { getEvents } from "@/lib/queries/events";
import { EventList } from "@/components/events/EventList";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

interface TcgLandingPageProps {
  tcgType: string;
  locale: string;
  urlSlug: string;
}

export async function TcgLandingPage({ tcgType, locale, urlSlug }: TcgLandingPageProps) {
  const config = TCG_CONFIG[tcgType as TCGType];
  const { data: events, total } = await getEvents({ tcgTypes: [tcgType] }, 1, 24);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const isFr = locale === "fr";

  const pageTitle = isFr
    ? `Événements ${config.label} en France`
    : `${config.label} Events in France`;

  const subtitle = isFr
    ? `Tournois, bourses, conventions et drafts — agenda complet mis à jour quotidiennement.`
    : `Tournaments, trade fairs, conventions and drafts — complete calendar updated daily.`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: subtitle,
    url: `${appUrl}/${locale}/evenements/${urlSlug}`,
    mainEntity: {
      "@type": "ItemList",
      name: pageTitle,
      numberOfItems: total,
      itemListElement: events.slice(0, 10).map((event, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: event.title,
        url: `${appUrl}/${locale}/evenements/${event.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BreadcrumbSchema
        locale={locale}
        eventTitle={config.label}
        slug={urlSlug}
      />

      <div className="container py-8">
        <Link
          href="/evenements"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFr ? "Tous les événements" : "All events"}
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl" aria-hidden="true">{config.emoji}</span>
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl">{subtitle}</p>
        </header>

        <EventList events={events} total={total} />

        {total > 24 && (
          <div className="mt-8 text-center">
            <Link
              href={`/evenements?tcg=${tcgType}`}
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            >
              {isFr ? `Voir les ${total} événements →` : `View all ${total} events →`}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
