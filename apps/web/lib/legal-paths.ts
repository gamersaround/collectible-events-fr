export const LEGAL_PAGE_KEYS = [
  "about",
  "contact",
  "legal",
  "privacy",
  "cookies",
] as const;

export type LegalPageKey = (typeof LEGAL_PAGE_KEYS)[number];

/** Public URL paths (no locale prefix). Folder names stay FR; EN aliases via rewrites. */
export const LEGAL_ROUTES: Record<LegalPageKey, { fr: string; en: string }> = {
  about: { fr: "/a-propos", en: "/about" },
  contact: { fr: "/contact", en: "/contact" },
  legal: { fr: "/mentions-legales", en: "/legal" },
  privacy: { fr: "/confidentialite", en: "/privacy" },
  cookies: { fr: "/cookies", en: "/cookies" },
};

export function legalPublicPath(locale: string, page: LegalPageKey): string {
  const paths = LEGAL_ROUTES[page];
  return locale === "en" ? paths.en : paths.fr;
}

export function legalPublicUrl(
  locale: string,
  page: LegalPageKey,
  appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com",
): string {
  return `${appUrl}/${locale}${legalPublicPath(locale, page)}`;
}
