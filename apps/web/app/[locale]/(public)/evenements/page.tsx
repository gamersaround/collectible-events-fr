import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

  return {
    title,
    description: t("metaDescription", { tcg: tcg ?? (locale === "fr" ? "événements de cartes à collectionner" : "collectible card events") }),
  };
}

const PER_PAGE = 24;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFiltersFromParams(params);
  const page = parseInt((params.page as string) ?? "1", 10) || 1;

  const { data: events, total, totalPages } = await getEvents(filters, page, PER_PAGE);

  return (
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
  );
}
