import { getTranslations } from "next-intl/server";
import { EventCard } from "./EventCard";
import type { EventRow } from "@/lib/queries/events";

interface FeaturedEventsSectionProps {
  events: EventRow[];
  className?: string;
}

export async function FeaturedEventsSection({
  events,
  className = "",
}: FeaturedEventsSectionProps) {
  if (events.length === 0) {
    return null;
  }

  const t = await getTranslations("selection");

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40 mb-1">
            CardAgenda
          </p>
          <h2
            id="notre-selection-heading"
            className="font-display text-2xl md:text-3xl font-black text-black"
          >
            {t("title")}
          </h2>
          <p className="text-sm text-black/55 font-medium mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
