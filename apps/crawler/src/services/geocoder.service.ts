/**
 * Geocoding service using api-adresse.data.gouv.fr (primary)
 * and Nominatim OSM (fallback, rate-limited to 1 req/s).
 */

interface GeoResult {
  latitude: number;
  longitude: number;
  label: string;
  city?: string;
  postalCode?: string;
  departmentCode?: string;
}

let lastNominatimCall = 0;
const NOMINATIM_DELAY_MS = 1100; // 1 req/s + margin

/**
 * Geocode a French address using api-adresse.data.gouv.fr.
 * Free, no rate limit, very accurate for France.
 */
async function geocodeWithBAN(query: string): Promise<GeoResult | null> {
  try {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1&countrycode=FR`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json() as {
      features: Array<{
        geometry: { coordinates: [number, number] };
        properties: {
          label: string;
          city: string;
          postcode: string;
          context: string; // "75, Paris, Île-de-France"
        };
      }>;
    };

    const feature = data.features[0];
    if (!feature) return null;

    const [longitude, latitude] = feature.geometry.coordinates;
    const context = feature.properties.context.split(", ");
    const departmentCode = context[0]?.trim();

    return {
      latitude,
      longitude,
      label: feature.properties.label,
      city: feature.properties.city,
      postalCode: feature.properties.postcode,
      departmentCode,
    };
  } catch {
    return null;
  }
}

/**
 * Geocoder international : Nominatim OSM.
 * Rate-limited to 1 req/s per ToS. No country restriction.
 */
async function geocodeWithNominatim(query: string): Promise<GeoResult | null> {
  const now = Date.now();
  const elapsed = now - lastNominatimCall;
  if (elapsed < NOMINATIM_DELAY_MS) {
    await new Promise((r) => setTimeout(r, NOMINATIM_DELAY_MS - elapsed));
  }
  lastNominatimCall = Date.now();

  const userAgent = process.env.NOMINATIM_USER_AGENT ?? "agenda-cartes/1.0";

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const data = await res.json() as Array<{ lat: string; lon: string; display_name: string }>;
    const result = data[0];
    if (!result) return null;

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      label: result.display_name,
    };
  } catch {
    return null;
  }
}

/**
 * Geocode a location.
 * For France: tries BAN first (fast, free), falls back to Nominatim.
 * For other countries: uses Nominatim directly (international).
 */
export async function geocode(
  address: string | null,
  city: string,
  postalCode?: string | null,
  country?: string | null
): Promise<GeoResult | null> {
  const countryLabel = country ?? "France";
  const isFrance = !country || country.toLowerCase() === "france" || country.toLowerCase() === "fr";

  // Build query
  const query = [address, postalCode, city, countryLabel]
    .filter(Boolean)
    .join(", ");

  if (isFrance) {
    // Try BAN first (fast, free, FR-only)
    const banResult = await geocodeWithBAN(query);
    if (banResult) return banResult;
  }

  // Nominatim: works for all countries
  const cityQuery = [postalCode, city, countryLabel].filter(Boolean).join(", ");
  return geocodeWithNominatim(cityQuery);
}

/**
 * Extract department code from postal code.
 */
export function departmentCodeFromPostalCode(postalCode: string): string {
  if (postalCode.startsWith("97")) return postalCode.slice(0, 3);
  if (postalCode.startsWith("20")) {
    const num = parseInt(postalCode.slice(0, 5));
    return num >= 20200 ? "2B" : "2A";
  }
  return postalCode.slice(0, 2);
}
