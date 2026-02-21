import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Format a date for display in French.
 */
export function formatDateFr(date: string | Date, formatStr = "EEEE d MMMM yyyy"): string {
  return format(new Date(date), formatStr, { locale: fr });
}

/**
 * Format event date range (start → end).
 */
export function formatEventDateRange(startsAt: string, endsAt?: string | null): string {
  const start = new Date(startsAt);
  const startStr = format(start, "EEEE d MMMM yyyy", { locale: fr });

  if (!endsAt) return startStr;

  const end = new Date(endsAt);

  // Same day
  if (format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
    return `${startStr}, ${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
  }

  return `${startStr} au ${format(end, "d MMMM yyyy", { locale: fr })}`;
}

/**
 * Human-readable relative time ("dans 3 jours", "hier", etc.)
 */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);

  if (isToday(d)) return "Aujourd'hui";
  if (isTomorrow(d)) return "Demain";
  if (isThisWeek(d, { locale: fr })) {
    return format(d, "EEEE", { locale: fr });
  }

  return formatDistanceToNow(d, { locale: fr, addSuffix: true });
}

/**
 * Format time in HH:mm (Paris timezone aware).
 */
export function formatTime(date: string | Date): string {
  return format(new Date(date), "HH:mm");
}

/**
 * Format entry fee in euros.
 */
export function formatEntryFee(fee: number | null): string {
  if (fee === null || fee === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(fee);
}
