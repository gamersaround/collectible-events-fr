import { slugify } from "@/lib/utils/slugify";
import { countryCode } from "@/lib/countries";
import { TCG_SLUG_MAP } from "@/lib/tcg-slugs";

export type FrPrep = "en" | "au" | "aux" | "à";

export type CountryMeta = {
  code: string;
  slugFr: string;
  slugEn: string;
  nameFr: string;
  nameEn: string;
  prepFr: FrPrep;
};

/** Europe catalogue only — ISO-2 codes used on city/country landings. */
export const COUNTRY_META: CountryMeta[] = [
  { code: "FR", slugFr: "france", slugEn: "france", nameFr: "France", nameEn: "France", prepFr: "en" },
  { code: "MC", slugFr: "monaco", slugEn: "monaco", nameFr: "Monaco", nameEn: "Monaco", prepFr: "à" },
  { code: "BE", slugFr: "belgique", slugEn: "belgium", nameFr: "Belgique", nameEn: "Belgium", prepFr: "en" },
  { code: "NL", slugFr: "pays-bas", slugEn: "netherlands", nameFr: "Pays-Bas", nameEn: "Netherlands", prepFr: "aux" },
  { code: "LU", slugFr: "luxembourg", slugEn: "luxembourg", nameFr: "Luxembourg", nameEn: "Luxembourg", prepFr: "au" },
  { code: "GB", slugFr: "royaume-uni", slugEn: "united-kingdom", nameFr: "Royaume-Uni", nameEn: "United Kingdom", prepFr: "au" },
  { code: "IE", slugFr: "irlande", slugEn: "ireland", nameFr: "Irlande", nameEn: "Ireland", prepFr: "en" },
  { code: "GI", slugFr: "gibraltar", slugEn: "gibraltar", nameFr: "Gibraltar", nameEn: "Gibraltar", prepFr: "à" },
  { code: "DE", slugFr: "allemagne", slugEn: "germany", nameFr: "Allemagne", nameEn: "Germany", prepFr: "en" },
  { code: "AT", slugFr: "autriche", slugEn: "austria", nameFr: "Autriche", nameEn: "Austria", prepFr: "en" },
  { code: "CH", slugFr: "suisse", slugEn: "switzerland", nameFr: "Suisse", nameEn: "Switzerland", prepFr: "en" },
  { code: "ES", slugFr: "espagne", slugEn: "spain", nameFr: "Espagne", nameEn: "Spain", prepFr: "en" },
  { code: "PT", slugFr: "portugal", slugEn: "portugal", nameFr: "Portugal", nameEn: "Portugal", prepFr: "au" },
  { code: "IT", slugFr: "italie", slugEn: "italy", nameFr: "Italie", nameEn: "Italy", prepFr: "en" },
  { code: "GR", slugFr: "grece", slugEn: "greece", nameFr: "Grèce", nameEn: "Greece", prepFr: "en" },
  { code: "MT", slugFr: "malte", slugEn: "malta", nameFr: "Malte", nameEn: "Malta", prepFr: "à" },
  { code: "DK", slugFr: "danemark", slugEn: "denmark", nameFr: "Danemark", nameEn: "Denmark", prepFr: "au" },
  { code: "SE", slugFr: "suede", slugEn: "sweden", nameFr: "Suède", nameEn: "Sweden", prepFr: "en" },
  { code: "NO", slugFr: "norvege", slugEn: "norway", nameFr: "Norvège", nameEn: "Norway", prepFr: "en" },
  { code: "FI", slugFr: "finlande", slugEn: "finland", nameFr: "Finlande", nameEn: "Finland", prepFr: "en" },
  { code: "IS", slugFr: "islande", slugEn: "iceland", nameFr: "Islande", nameEn: "Iceland", prepFr: "en" },
  { code: "PL", slugFr: "pologne", slugEn: "poland", nameFr: "Pologne", nameEn: "Poland", prepFr: "en" },
  { code: "CZ", slugFr: "republique-tcheque", slugEn: "czech-republic", nameFr: "République tchèque", nameEn: "Czech Republic", prepFr: "en" },
  { code: "SK", slugFr: "slovaquie", slugEn: "slovakia", nameFr: "Slovaquie", nameEn: "Slovakia", prepFr: "en" },
  { code: "HU", slugFr: "hongrie", slugEn: "hungary", nameFr: "Hongrie", nameEn: "Hungary", prepFr: "en" },
  { code: "RO", slugFr: "roumanie", slugEn: "romania", nameFr: "Roumanie", nameEn: "Romania", prepFr: "en" },
  { code: "BG", slugFr: "bulgarie", slugEn: "bulgaria", nameFr: "Bulgarie", nameEn: "Bulgaria", prepFr: "en" },
  { code: "SI", slugFr: "slovenie", slugEn: "slovenia", nameFr: "Slovénie", nameEn: "Slovenia", prepFr: "en" },
  { code: "HR", slugFr: "croatie", slugEn: "croatia", nameFr: "Croatie", nameEn: "Croatia", prepFr: "en" },
  { code: "RS", slugFr: "serbie", slugEn: "serbia", nameFr: "Serbie", nameEn: "Serbia", prepFr: "en" },
  { code: "LT", slugFr: "lituanie", slugEn: "lithuania", nameFr: "Lituanie", nameEn: "Lithuania", prepFr: "en" },
  { code: "LV", slugFr: "lettonie", slugEn: "latvia", nameFr: "Lettonie", nameEn: "Latvia", prepFr: "en" },
  { code: "EE", slugFr: "estonie", slugEn: "estonia", nameFr: "Estonie", nameEn: "Estonia", prepFr: "en" },
  { code: "CY", slugFr: "chypre", slugEn: "cyprus", nameFr: "Chypre", nameEn: "Cyprus", prepFr: "à" },
];

export const EUROPE_COUNTRY_CODES = new Set(COUNTRY_META.map((c) => c.code));

const EXTRA_ALIASES: Record<string, string> = {
  uk: "GB",
  gb: "GB",
  holland: "NL",
  czechia: "CZ",
};

const CODE_BY_SLUG = new Map<string, string>();
for (const row of COUNTRY_META) {
  CODE_BY_SLUG.set(row.slugFr, row.code);
  CODE_BY_SLUG.set(row.slugEn, row.code);
  CODE_BY_SLUG.set(row.code.toLowerCase(), row.code);
}
for (const [alias, code] of Object.entries(EXTRA_ALIASES)) {
  CODE_BY_SLUG.set(alias, code);
}

export function getCountryMeta(code: string | null | undefined): CountryMeta | undefined {
  const c = countryCode(code);
  return COUNTRY_META.find((row) => row.code === c);
}

export function countryPathSlug(code: string, locale: string): string {
  const meta = getCountryMeta(code);
  if (!meta) return countryCode(code).toLowerCase();
  return locale === "en" ? meta.slugEn : meta.slugFr;
}

export function countryCodeFromSlug(slug: string): string | undefined {
  return CODE_BY_SLUG.get(slug.toLowerCase());
}

export function isReservedLandingSlug(slug: string): boolean {
  return slug in TCG_SLUG_MAP;
}

export type CountryMatch = {
  kind: "country";
  code: string;
  canonicalSlug: string;
  label: string;
  prepFr: FrPrep;
  slugFr: string;
  slugEn: string;
};

export type CityMatch = {
  kind: "city";
  canonicalSlug: string;
  displayName: string;
  cityNames: string[];
  countryCode?: string;
};

export function matchCountrySlug(slug: string, locale: string): CountryMatch | null {
  if (isReservedLandingSlug(slug)) return null;
  const code = countryCodeFromSlug(slug);
  if (!code || !EUROPE_COUNTRY_CODES.has(code)) return null;
  const meta = getCountryMeta(code);
  if (!meta) return null;
  const canonicalSlug = locale === "en" ? meta.slugEn : meta.slugFr;
  return {
    kind: "country",
    code,
    canonicalSlug,
    label: locale === "en" ? meta.nameEn : meta.nameFr,
    prepFr: meta.prepFr,
    slugFr: meta.slugFr,
    slugEn: meta.slugEn,
  };
}

export function citySlug(city: string): string {
  return slugify(city);
}

export function matchCitySlug(
  slug: string,
  locations: { city: string; country: string }[]
): CityMatch | null {
  if (isReservedLandingSlug(slug) || countryCodeFromSlug(slug)) return null;
  const wanted = slug.toLowerCase();
  const hits = locations.filter((row) => citySlug(row.city) === wanted && row.city);
  const europeHits = hits.filter((row) => EUROPE_COUNTRY_CODES.has(countryCode(row.country)));
  const use = europeHits.length > 0 ? europeHits : [];
  if (use.length === 0) return null;

  const names = Array.from(new Set(use.map((r) => r.city)));
  const countries = Array.from(new Set(use.map((r) => countryCode(r.country))));
  return {
    kind: "city",
    canonicalSlug: wanted,
    displayName: names[0],
    cityNames: names,
    countryCode: countries.length === 1 ? countries[0] : undefined,
  };
}

export function geoPageCopy(
  locale: string,
  match: CountryMatch | CityMatch
): { title: string; description: string } {
  const isFr = locale === "fr";
  if (match.kind === "country") {
    const place = match.label;
    const title = isFr
      ? `Événements cartes à collectionner ${match.prepFr} ${place}`
      : `Collectible card events in ${place}`;
    const description = isFr
      ? `Tournois, bourses et conventions de cartes à collectionner ${match.prepFr} ${place} : Pokémon, Magic, Yu-Gi-Oh, cartes sportives. Agenda Europe.`
      : `Collectible card tournaments, trade fairs and conventions in ${place}: Pokémon, Magic, Yu-Gi-Oh, sports cards. Europe calendar.`;
    return { title, description };
  }
  const city = match.displayName;
  const title = isFr
    ? `Événements cartes à collectionner à ${city}`
    : `Collectible card events in ${city}`;
  const description = isFr
    ? `Tournois, bourses et conventions de cartes à collectionner à ${city} : Pokémon, Magic, Yu-Gi-Oh, cartes sportives. Agenda Europe.`
    : `Collectible card tournaments, trade fairs and conventions in ${city}: Pokémon, Magic, Yu-Gi-Oh, sports cards. Europe calendar.`;
  return { title, description };
}
