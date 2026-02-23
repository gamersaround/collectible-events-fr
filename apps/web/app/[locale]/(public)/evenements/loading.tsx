import { EventCardSkeleton } from "@/components/events/EventCard";

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
