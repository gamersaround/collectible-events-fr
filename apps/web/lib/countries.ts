/** Europe-first country groups for listing filters. Codes are ISO 3166-1 alpha-2. */

export type CountrySectionId =
  | "france"
  | "uk"
  | "benelux"
  | "dach"
  | "south"
  | "north"
  | "central"
  | "other";

export const COUNTRY_SECTIONS: { id: CountrySectionId; codes: string[] }[] = [
  { id: "france", codes: ["FR", "MC"] },
  { id: "uk", codes: ["GB", "IE", "GI"] },
  { id: "benelux", codes: ["BE", "NL", "LU"] },
  { id: "dach", codes: ["DE", "AT", "CH"] },
  { id: "south", codes: ["ES", "PT", "IT", "GR", "MT"] },
  { id: "north", codes: ["DK", "SE", "NO", "FI", "IS"] },
  { id: "central", codes: ["PL", "CZ", "SK", "HU", "RO", "BG", "SI", "HR", "RS", "LT", "LV", "EE", "CY"] },
];

const SECTION_CODE_SET = new Set(COUNTRY_SECTIONS.flatMap((s) => s.codes));

/** ISO-2 for display; Sanity stores alpha-2, with a few aliases. */
export function countryCode(country?: string | null): string {
  if (!country) return "FR";
  const c = country.trim().toUpperCase();
  if (c === "UK") return "GB";
  if (c === "FRANCE") return "FR";
  return c;
}

export function countrySectionsFor(available?: string[]) {
  const known = (available ?? []).filter((c) => c && c !== "??");
  const allow = known.length > 0 ? new Set(known) : null;

  const sections = COUNTRY_SECTIONS.map((section) => ({
    id: section.id,
    codes: section.codes.filter((code) => !allow || allow.has(code)),
  })).filter((section) => section.codes.length > 0);

  if (allow) {
    const extras = Array.from(allow)
      .filter((c) => !SECTION_CODE_SET.has(c))
      .sort();
    if (extras.length > 0) {
      sections.push({ id: "other", codes: extras });
    }
  }

  return sections;
}
