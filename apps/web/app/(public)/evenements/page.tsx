import { Suspense } from "react";
import type { Metadata } from "next";
import { getEvents, getDepartments } from "@/lib/queries/events";
import { EventList, EventListSkeleton } from "@/components/events/EventList";
import { EventFilters } from "@/components/events/EventFilters";
import { parseFiltersFromParams } from "@/hooks/useFilters";
import { Pagination } from "@/components/ui/Pagination";

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const tcg = Array.isArray(params.tcg) ? params.tcg[0] : params.tcg;
  const dept = Array.isArray(params.dept) ? params.dept[0] : params.dept;

  let title = "Événements TCG en France";
  if (tcg) title = `Événements ${tcg} en France`;
  if (dept) title += ` — Département ${dept}`;

  return {
    title,
    description: `Trouvez tous les événements ${tcg ?? "TCG"} en France : tournois, bourses, conventions.`,
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

  const [{ data: events, total, totalPages }, departments] = await Promise.all([
    getEvents(filters, page, PER_PAGE),
    getDepartments(),
  ]);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Événements TCG en France
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 shrink-0">
          <Suspense>
            <EventFilters departments={departments} />
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
                searchParams={params}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
