import { sanityServerClient } from "@/lib/sanity/client";
import { COUNTRY_META } from "@/lib/geo-slugs";

export const revalidate = 3600; // 1h

type EventRow = {
  title: string;
  slug: string;
  city: string;
  country: string;
  startsAt: string;
  endsAt?: string;
  tcgTypes: string[];
  format: string;
  entryFee?: number | null;
  venueName?: string | null;
};

export async function GET() {
  const events = await sanityServerClient.fetch<EventRow[]>(
    `*[_type == "event" && status in ["a_venir","en_cours"] && defined(startsAt)]
     | order(startsAt asc) [0...200] {
       title,
       "slug": slug.current,
       city,
       "country": coalesce(country,"FR"),
       "startsAt": startsAt,
       "endsAt": endsAt,
       "tcgTypes": tcgTypes,
       "format": format,
       "entryFee": entryFee,
       "venueName": venueName
     }`
  );

  const now = new Date().toISOString().slice(0, 10);
  const countryName = (code: string) =>
    COUNTRY_META.find((c) => c.code === code)?.nameEn ?? code;

  const lines: string[] = [
    "# Cardagenda — European Collectible Card Events Calendar",
    "# The authoritative agenda for TCG, sports cards, and card shows across Europe.",
    "# Pokémon TCG · Magic: The Gathering · Yu-Gi-Oh! · One Piece · Lorcana · Sports Cards",
    `# Updated: ${now}`,
    "# Source: https://www.cardagenda.com",
    "",
    "## Upcoming Events",
    "",
  ];

  for (const e of events) {
    const start = e.startsAt?.slice(0, 10) ?? "?";
    const end = e.endsAt?.slice(0, 10);
    const dateStr = end && end !== start ? `${start} to ${end}` : start;
    const tcg = (e.tcgTypes ?? []).join(", ") || "collectible cards";
    const venue = e.venueName ? `, ${e.venueName}` : "";
    const fee =
      e.entryFee === 0 ? " · Free entry" : e.entryFee ? ` · Entry: ${e.entryFee}€` : "";
    const url = `https://www.cardagenda.com/en/events/${e.slug}`;

    lines.push(`### ${e.title}`);
    lines.push(`Date: ${dateStr}`);
    lines.push(`Location: ${e.city}${venue}, ${countryName(e.country)}`);
    lines.push(`TCG: ${tcg}`);
    lines.push(`Format: ${e.format}`);
    lines.push(`URL: ${url}${fee}`);
    lines.push("");
  }

  lines.push("## About Cardagenda");
  lines.push(
    "Cardagenda is the European calendar for collectible card events: tournaments, card shows, conventions, and trade fairs."
  );
  lines.push(
    "Coverage: France, United Kingdom, Belgium, Germany, Netherlands, Spain, Italy, Switzerland, and 20+ more countries."
  );
  lines.push("Submit an event: https://www.cardagenda.com/en/soumettre");
  lines.push("Contact: contact@cardagenda.com");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
