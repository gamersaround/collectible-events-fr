import { ImageResponse } from "next/og";
import { countryCode, countryFlagEmoji } from "@/lib/countries";

export const runtime = "edge";
export const alt = "Cardagenda event";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch minimal event data from Sanity public CDN — no Node.js client needed on Edge.
async function fetchOgEvent(slug: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const query = encodeURIComponent(
    `*[_type == "event" && slug.current == "${slug}"][0]{title, city, "country": coalesce(country,"FR"), "starts_at": startsAt, "tcg_types": tcgTypes, format}`
  );
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.result ?? null;
  } catch {
    return null;
  }
}

function formatOgDate(startsAt: string): string {
  try {
    const d = new Date(startsAt);
    // e.g. "14 juin 2025"
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// Brand colours matching the site palette
const BLUE = "#2563eb";  // blue-600
const DARK = "#111827";  // gray-900
const LIGHT = "#f9fafb"; // gray-50
const BORDER = "#dbeafe"; // blue-100

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const event = await fetchOgEvent(slug);

  // For TCG landing / geo pages (no event found), render a generic brand card.
  if (!event) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: BLUE,
            color: "#fff",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 16 }}>
            Cardagenda
          </div>
          <div style={{ fontSize: 28, opacity: 0.85 }}>
            Événements cartes à collectionner en Europe
          </div>
        </div>
      ),
      { ...size }
    );
  }

  const flag = countryFlagEmoji(event.country);
  const code = countryCode(event.country);
  const dateLabel = event.starts_at ? formatOgDate(event.starts_at) : "";
  // Build location line: "🇫🇷  Paris · FR"
  const locationLine = [flag, event.city, code ? `· ${code}` : ""]
    .filter(Boolean)
    .join("  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: LIGHT,
          fontFamily: "sans-serif",
          padding: 0,
          border: `6px solid ${BLUE}`,
          boxSizing: "border-box",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            background: BLUE,
            height: 12,
            width: "100%",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 64px 40px",
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: BLUE,
              letterSpacing: 1,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Cardagenda
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: DARK,
              lineHeight: 1.15,
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {event.title}
          </div>

          {/* Location + Date row */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 34,
                color: DARK,
                display: "flex",
              }}
            >
              {locationLine}
            </div>
            {dateLabel && (
              <div
                style={{
                  fontSize: 28,
                  color: "#6b7280",
                  display: "flex",
                }}
              >
                {dateLabel}
              </div>
            )}
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            background: BORDER,
            padding: "14px 64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 20, color: BLUE, fontWeight: 600, display: "flex" }}>
            cardagenda.com
          </div>
          <div style={{ fontSize: 18, color: "#6b7280", display: "flex" }}>
            Événements cartes à collectionner
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
