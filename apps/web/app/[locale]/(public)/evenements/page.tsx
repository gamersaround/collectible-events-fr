import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getEvents } from "@/lib/queries/events";
import { EventList, EventListSkeleton } from "@/components/events/EventList";
import { EventFilters } from "@/components/events/EventFilters";
import { parseFiltersFromParams } from "@/lib/utils/filters";
import { Pagination } from "@/components/ui/Pagination";

export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "events" });

  const tcg = Array.isArray(sp.tcg) ? sp.tcg[0] : sp.tcg;

  const title = tcg ? t("metaTitleWithTcg", { tcg }) : t("metaTitleDefault");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const otherLocale = locale === "fr" ? "en" : "fr";
  return {
    title,
    description: t("metaDescription", { tcg: tcg ?? (locale === "fr" ? "événements de cartes à collectionner" : "collectible card events") }),
    alternates: {
      canonical: `${appUrl}/${locale}/evenements`,
      languages: {
        [locale]: `${appUrl}/${locale}/evenements`,
        [otherLocale]: `${appUrl}/${otherLocale}/evenements`,
        "x-default": `${appUrl}/fr/evenements`,
      },
    },
  };
}

const PER_PAGE = 24;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const params = await searchParams;
  const filters = parseFiltersFromParams(params);
  const page = parseInt((params.page as string) ?? "1", 10) || 1;

  const { data: events, total, totalPages } = await getEvents(filters, page, PER_PAGE);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const isFr = locale === "fr";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isFr ? "Événements cartes à collectionner en France" : "Collectible card events in France",
    description: isFr
      ? "Tous les tournois, bourses et conventions de cartes à collectionner en France et en Belgique."
      : "All tournaments, trade fairs and conventions for collectible cards in France and Belgium.",
    url: `${appUrl}/${locale}/evenements`,
    mainEntity: {
      "@type": "ItemList",
      name: isFr ? "Événements à venir" : "Upcoming events",
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
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {/* Heading is rendered by EventList */}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 shrink-0">
          <Suspense>
            <EventFilters />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<EventListSkeleton />}>
            <EventList events={events} total={total} />
          </Suspense>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/evenements"
                searchParams={params}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
