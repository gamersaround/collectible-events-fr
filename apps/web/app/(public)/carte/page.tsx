import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getEventsForMap } from "@/lib/queries/events";
import { TCG_CONFIG } from "@agenda-cartes/shared";

export const metadata: Metadata = {
  title: "Carte des événements",
  description:
    "Visualisez tous les événements de cartes à collectionner sur une carte interactive. Pokémon, Magic, Yu-Gi-Oh, cartes sport et plus.",
};

export const revalidate = 3600;

// Dynamic import with SSR disabled for Leaflet
const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" style={{ height: "600px" }} />
  ),
});

export default async function MapPage() {
  const events = await getEventsForMap();

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Carte des événements TCG
        </h1>
        <p className="text-gray-500">
          {events.length} événement{events.length > 1 ? "s" : ""} à venir
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(TCG_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5 text-sm">
            <span
              className="w-3 h-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: config.markerColor }}
            />
            <span className="text-gray-600">{config.labelShort}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <EventMap events={events} height="600px" />

      {/* Note */}
      <p className="mt-3 text-xs text-gray-400 text-center">
        Seuls les événements avec des coordonnées géographiques sont affichés sur la carte.
        Cliquez sur un marqueur pour voir les détails.
      </p>
    </div>
  );
}
