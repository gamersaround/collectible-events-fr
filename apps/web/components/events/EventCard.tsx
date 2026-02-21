import Link from "next/link";
import { MapPin, Calendar, Euro, Users } from "lucide-react";
import type { EventRow } from "@/lib/queries/events";
import { EventBadge, FormatBadge } from "./EventBadge";
import { formatRelativeDate, formatDateFr, formatEntryFee } from "@/lib/utils/dates";
import { TCGType } from "@agenda-cartes/shared";

interface EventCardProps {
  event: EventRow;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link href={`/evenements/${event.slug}`} className="block p-5">
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {event.tcg_types.map((tcg) => (
            <EventBadge key={tcg} tcgType={tcg as TCGType} size="sm" />
          ))}
          <FormatBadge format={event.format} />
        </div>

        {/* Title */}
        <h2 className="font-semibold text-gray-900 text-base leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h2>

        {/* Meta info */}
        <div className="space-y-1.5">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <span>
              <span className="font-medium text-gray-800">
                {formatRelativeDate(event.starts_at)}
              </span>
              {" — "}
              {formatDateFr(event.starts_at, "d MMM yyyy")}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">
              {event.venue_name ? (
                <>
                  <span className="font-medium text-gray-800">{event.city}</span>
                  {" · "}
                  {event.venue_name}
                </>
              ) : (
                <span className="font-medium text-gray-800">{event.city}</span>
              )}
              {event.department_code && (
                <span className="text-gray-400 ml-1">({event.department_code})</span>
              )}
            </span>
          </div>

          {/* Entry fee */}
          <div className="flex items-center gap-2 text-sm">
            <Euro className="h-4 w-4 text-gray-400 shrink-0" />
            <span className={event.entry_fee === null || event.entry_fee === 0 ? "text-green-600 font-medium" : "text-gray-600"}>
              {formatEntryFee(event.entry_fee)}
            </span>

            {event.max_participants && (
              <span className="flex items-center gap-1 ml-2 text-gray-500">
                <Users className="h-3.5 w-3.5" />
                {event.max_participants} places
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

// Skeleton loader for Suspense fallback
export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-5 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-100 rounded w-4/5 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}
