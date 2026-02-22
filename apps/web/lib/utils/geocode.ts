export async function geocodeCity(
  city: string,
  address?: string | null,
  postalCode?: string | null,
  country?: string | null
): Promise<{ latitude: number; longitude: number } | null> {
  const countryLabel = country && country !== "FR" ? country : "France";
  const query = [address, postalCode, city, countryLabel].filter(Boolean).join(", ");
  const userAgent = process.env.NOMINATIM_USER_AGENT ?? "agenda-cartes/1.0";

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": userAgent, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data[0]) return null;
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
