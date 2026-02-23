import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEventsForMap } from "@/lib/queries/events";
import { TCG_CONFIG } from "@agenda-cartes/shared";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });

  return {
    title: t("title"),
    description: locale === "fr"
      ? "Visualisez tous les événements cartes à collectionner sur carte interactive : tournois Pokémon, Magic, Yu-Gi-Oh, cartes NBA et foot, en France et Belgique."
      : "View all collectible card events on an interactive map: Pokémon, Magic, Yu-Gi-Oh, NBA and football cards in France and Belgium.",
  };
}

const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" style={{ height: "600px" }} />
  ),
});

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  const events = await getEventsForMap();

  const eventsCountLabel = events.length === 1
    ? t("eventsCountOne", { count: events.length })
    : t("eventsCountOther", { count: events.length });

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-500">{eventsCountLabel}</p>
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
      <p className="mt-3 text-xs text-gray-400 text-center">{t("note")}</p>
    </div>
  );
}
