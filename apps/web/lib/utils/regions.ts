// French regions grouped with their departments
export const REGIONS_FR: Record<string, string[]> = {
  "Île-de-France": ["75", "77", "78", "91", "92", "93", "94", "95"],
  "Auvergne-Rhône-Alpes": ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"],
  "Nouvelle-Aquitaine": ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"],
  "Occitanie": ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"],
  "Hauts-de-France": ["02", "59", "60", "62", "80"],
  "Grand Est": ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
  "Provence-Alpes-Côte d'Azur": ["04", "05", "06", "13", "83", "84"],
  "Pays de la Loire": ["44", "49", "53", "72", "85"],
  "Bretagne": ["22", "29", "35", "56"],
  "Normandie": ["14", "27", "50", "61", "76"],
  "Bourgogne-Franche-Comté": ["21", "25", "39", "58", "70", "71", "89", "90"],
  "Centre-Val de Loire": ["18", "28", "36", "37", "41", "45"],
  "Corse": ["2A", "2B"],
  "Guadeloupe": ["971"],
  "Martinique": ["972"],
  "Guyane": ["973"],
  "La Réunion": ["974"],
  "Mayotte": ["976"],
};

export function getDepartmentRegion(departmentCode: string): string | null {
  for (const [region, departments] of Object.entries(REGIONS_FR)) {
    if (departments.includes(departmentCode)) return region;
  }
  return null;
}

export function getDepartmentsForRegion(region: string): string[] {
  return REGIONS_FR[region] ?? [];
}

export const ALL_REGIONS = Object.keys(REGIONS_FR);
