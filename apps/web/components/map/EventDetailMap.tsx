"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";

interface EventDetailMapProps {
  latitude: number;
  longitude: number;
  venueName?: string | null;
  address?: string | null;
  city: string;
  countryLabel?: string | null;
}

export default function EventDetailMap({
  latitude,
  longitude,
  venueName,
  address,
  city,
  countryLabel,
}: EventDetailMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="
          background: #2563eb;
          width: 32px; height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          display: flex; align-items: center; justify-content: center;
        "><span style="transform: rotate(45deg); font-size: 14px;">📍</span></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      const popupLines = [
        venueName ? `<div style="font-weight:600;font-size:13px;color:#111827;margin-bottom:2px;">${venueName}</div>` : "",
        address ? `<div style="font-size:12px;color:#6b7280;">${address}</div>` : "",
        `<div style="font-size:12px;color:#6b7280;">${city}</div>`,
        countryLabel ? `<div style="font-size:11px;color:#6b7280;">${countryLabel}</div>` : "",
      ].filter(Boolean).join("");

      L.marker([latitude, longitude], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:system-ui,sans-serif;padding:2px 4px;">${popupLines}</div>`)
        .openPopup();
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, venueName, address, city, countryLabel]);

  return (
    <div
      ref={containerRef}
      style={{ height: "220px", width: "100%" }}
      className="rounded-lg overflow-hidden border border-gray-200 mt-3"
    />
  );
}
