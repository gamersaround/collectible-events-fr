import { NextResponse } from "next/server";
import { sanityServerClient, sanityWriteClient } from "@/lib/sanity/client";
import { geocodeCity } from "@/lib/utils/geocode";

interface UngeocodedEvent {
  id: string;
  city: string;
  address: string | null;
  postal_code: string | null;
  country: string | null;
}

const UNGEOCODED_QUERY = `*[
  _type == "event"
  && status in ["a_venir", "en_cours"]
  && startsAt > $now
  && (latitude == null || !defined(latitude) || longitude == null || !defined(longitude))
][0...20] {
  "id": _id,
  city,
  address,
  "postal_code": postalCode,
  "country": coalesce(country, "FR")
}`;

export async function POST() {
  const now = new Date().toISOString();
  const events = await sanityServerClient.fetch<UngeocodedEvent[]>(UNGEOCODED_QUERY, { now });

  // Fire-and-forget — do not await
  geocodeInBackground(events);

  return NextResponse.json({ queued: events.length });
}

async function geocodeInBackground(events: UngeocodedEvent[]) {
  for (const event of events) {
    try {
      const geo = await geocodeCity(event.city, event.address, event.postal_code, event.country);
      if (geo) {
        await sanityWriteClient
          .patch(event.id)
          .set({ latitude: geo.latitude, longitude: geo.longitude })
          .commit();
      }
    } catch {
      // silently continue on individual failures
    }
    // Respect Nominatim rate limit (1 req/s)
    await new Promise((r) => setTimeout(r, 1100));
  }
}
