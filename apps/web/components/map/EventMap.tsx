"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
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
  const [mapReady, setMapReady] = useState(false);

  // Fire-and-forget: trigger background geocoding for events without coordinates
  useEffect(() => {
    fetch("/api/geocode", { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    // Dynamically import Leaflet + MarkerCluster to avoid SSR issues
    import("leaflet").then(async (L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      // Load cluster CSS
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");

      // markercluster's module.exports IS the extended L object — grab it from there
      const mcMod = await import("leaflet.markercluster");
      const extL = (mcMod as any).default ?? mcMod;

      // Fix Leaflet default icon path issue with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Initialize map centered on France
      const map = L.map(containerRef.current!, {
        center: [46.5, 2.5],
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

      // Create cluster group — use extended L from markercluster's own export,
      // with a fallback to plain layerGroup so the map never crashes
      const clusterGroup =
        typeof extL?.markerClusterGroup === "function"
          ? extL.markerClusterGroup({ maxClusterRadius: 60 })
          : L.layerGroup();

      const markerLatLngs: [number, number][] = [];

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

        const marker = L.marker([event.latitude, event.longitude], { icon }).bindPopup(popup);
        clusterGroup.addLayer(marker);

        markerLatLngs.push([event.latitude, event.longitude]);
      }

      map.addLayer(clusterGroup);

      // Auto-fit viewport to actual markers if any
      if (markerLatLngs.length > 0) {
        map.fitBounds(L.latLngBounds(markerLatLngs), { padding: [40, 40], maxZoom: 10 });
      }

      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [events]);

  return (
    <div className="relative" style={{ height, width: "100%" }}>
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 border-2 border-black z-10">
          <div className="w-10 h-10 border-4 border-black border-t-[#FFDE03] rounded-full animate-spin mb-3" />
          <p className="font-bold text-sm uppercase tracking-widest text-black">Chargement de la carte…</p>
        </div>
      )}
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
        className="border-2 border-black"
      />
    </div>
  );
}
