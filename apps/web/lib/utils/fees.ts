/**
 * Format entry fee. 0 is free; null/undefined is unknown (not free).
 * Pass translated labels for i18n.
 *
 * Kept out of `dates.ts` so client cards do not pull date-fns locales.
 */
export function formatEntryFee(
  fee: number | null,
  freeLabel = "Gratuit",
  unknownLabel = "Non mentionné"
): string {
  if (fee === null || fee === undefined) return unknownLabel;
  if (fee === 0) return freeLabel;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(fee);
}
