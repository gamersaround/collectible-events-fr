const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";

/** Public events path: FR `/evenements`, EN `/events`. */
export function eventsBasePath(locale: string): "/evenements" | "/events" {
  return locale === "en" ? "/events" : "/evenements";
}

export function eventsPath(locale: string, slug?: string): string {
  const base = `/${locale}${eventsBasePath(locale)}`;
  return slug ? `${base}/${slug}` : base;
}

export function eventsUrl(locale: string, slug?: string, appUrl = APP_URL): string {
  return `${appUrl}${eventsPath(locale, slug)}`;
}
