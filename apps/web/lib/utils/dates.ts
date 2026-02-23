import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek } from "date-fns";
import { fr, enGB } from "date-fns/locale";

type DateLocale = "fr" | "en";

function getDateFnsLocale(locale: DateLocale) {
  return locale === "fr" ? fr : enGB;
}

/**
 * Format a date for display in the given locale.
 */
export function formatDateFr(
  date: string | Date,
  formatStr = "EEEE d MMMM yyyy",
  locale: DateLocale = "fr"
): string {
  return format(new Date(date), formatStr, { locale: getDateFnsLocale(locale) });
}

/**
 * Format event date range (start → end).
 */
export function formatEventDateRange(
  startsAt: string,
  endsAt?: string | null,
  locale: DateLocale = "fr"
): string {
  const dateFnsLocale = getDateFnsLocale(locale);
  const start = new Date(startsAt);
  const startStr = format(start, "EEEE d MMMM yyyy", { locale: dateFnsLocale });

  if (!endsAt) return startStr;

  const end = new Date(endsAt);

  // Same day
  if (format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
    return `${startStr}, ${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
  }

  const connector = locale === "fr" ? "au" : "to";
  return `${startStr} ${connector} ${format(end, "d MMMM yyyy", { locale: dateFnsLocale })}`;
}

/**
 * Human-readable relative time ("dans 3 jours", "in 3 days", etc.)
 */
export function formatRelativeDate(date: string | Date, locale: DateLocale = "fr"): string {
  const dateFnsLocale = getDateFnsLocale(locale);
  const d = new Date(date);

  if (isToday(d)) return locale === "fr" ? "Aujourd'hui" : "Today";
  if (isTomorrow(d)) return locale === "fr" ? "Demain" : "Tomorrow";
  if (isThisWeek(d, { locale: dateFnsLocale })) {
    return format(d, "EEEE", { locale: dateFnsLocale });
  }

  return formatDistanceToNow(d, { locale: dateFnsLocale, addSuffix: true });
}

/**
 * Format time in HH:mm.
 */
export function formatTime(date: string | Date): string {
  return format(new Date(date), "HH:mm");
}

/**
 * Format entry fee. Pass a translated freeLabel for i18n.
 */
export function formatEntryFee(fee: number | null, freeLabel = "Gratuit"): string {
  if (fee === null || fee === 0) return freeLabel;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(fee);
}
