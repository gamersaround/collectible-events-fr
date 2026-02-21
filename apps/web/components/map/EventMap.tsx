"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { EventRow } from "@/lib/queries/events";
import { TCGType, TCG_CONFIG } from "@agenda-cartes/shared";

interface EventMapProps {
  events: Pick<EventRow, "id" | "slug" | "title" | "city" | "latitude" | "longitude" | "tcg_types" | "format" | "starts_at">[];
  height?: string;
}

// This component is loaded via dynamic import with ssr: false
export default function EventMap({ events, height = "600px" }: EventMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix Leaflet default icon path issue with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Initialize map centered on France
      const map = L.map(containerRef.current!, {
        center: [46.603354, 1.888334],
        zoom: 6,
        zoomControl: true,
      });

      mapRef.current = map;

      // Tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add markers for each event
      for (const event of events) {
        if (!event.latitude || !event.longitude) continue;

        // Pick color based on first TCG type
        const primaryTcg = (event.tcg_types[0] as TCGType) ?? TCGType.AUTRES;
        const config = TCG_CONFIG[primaryTcg];
        const markerColor = config?.markerColor ?? "#374151";

        // Custom colored marker using SVG
        const icon = L.divIcon({
          html: `
            <div style="
              background-color: ${markerColor};
              width: 28px;
              height: 28px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="transform: rotate(45deg); font-size: 12px; line-height: 1;">${config?.emoji ?? "🃏"}</span>
            </div>
          `,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
        });

        const startDate = new Date(event.starts_at).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        });

        const popup = L.popup({
          maxWidth: 250,
          className: "event-popup",
        }).setContent(`
          <div style="font-family: system-ui, sans-serif; padding: 4px;">
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px;">${startDate}</div>
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #111827;">${event.title}</div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">📍 ${event.city}</div>
            <a href="/evenements/${event.slug}"
               style="display: inline-block; background: #2563eb; color: white; padding: 4px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
              Voir les détails
            </a>
          </div>
        `);

        L.marker([event.latitude, event.longitude], { icon })
          .bindPopup(popup)
          .addTo(map);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [events]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%" }}
      className="rounded-xl overflow-hidden border border-gray-200"
    />
  );
}
