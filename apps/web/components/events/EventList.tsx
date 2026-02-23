import { getTranslations } from "next-intl/server";
import { EventCard, EventCardSkeleton } from "./EventCard";
import type { EventRow } from "@/lib/queries/events";

interface EventListProps {
  events: EventRow[];
  total: number;
}

export async function EventList({ events, total }: EventListProps) {
  const t = await getTranslations("events");

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🃏</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {t("noEventsTitle")}
        </h2>
        <p className="text-gray-500">
          {t("noEventsDescription")}
        </p>
      </div>
    );
  }

  const countLabel = total === 1 ? t("foundOne", { count: total }) : t("foundOther", { count: total });

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{countLabel}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
