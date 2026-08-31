"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { TCGType, TCG_CONFIG, EventFormat, EVENT_FORMAT_LABELS } from "@agenda-cartes/shared";
import { cn } from "@/lib/utils/cn";
import { countrySectionsFor } from "@/lib/countries";

export function EventFilters({ countries }: { countries?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("filters");
  const tc = useTranslations("countries");
  const ts = useTranslations("filters.countrySections");
  const countrySections = countrySectionsFor(countries);

  const createQueryString = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }

      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const navigateWithFilter = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      router.push(`${pathname}?${createQueryString(updates)}`, { scroll: false });
    },
    [router, pathname, createQueryString]
  );

  const activeTcgTypes = searchParams.getAll("tcg") as TCGType[];
  const activeFormats = searchParams.getAll("format") as EventFormat[];
  const activeCountry = searchParams.get("pays") ?? "";
  const activeSearch = searchParams.get("q") ?? "";
  const activeFreeOnly = searchParams.get("gratuit") === "1";

  const toggleTcgType = (tcg: TCGType) => {
    const next = activeTcgTypes.includes(tcg)
      ? activeTcgTypes.filter((t) => t !== tcg)
      : [...activeTcgTypes, tcg];
    navigateWithFilter({ tcg: next });
  };

  const toggleFormat = (format: EventFormat) => {
    const next = activeFormats.includes(format)
      ? activeFormats.filter((f) => f !== format)
      : [...activeFormats, format];
    navigateWithFilter({ format: next });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters =
    activeTcgTypes.length > 0 ||
    activeFormats.length > 0 ||
    activeCountry !== "" ||
    activeSearch !== "" ||
    activeFreeOnly;

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal className="h-4 w-4" />
          {t("title")}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <X className="h-3 w-3" />
            {t("clearAll")}
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("searchLabel")}</label>
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={activeSearch}
          onChange={(e) => navigateWithFilter({ q: e.target.value || null })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TCG Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("tcgTypeLabel")}</label>
        <div className="space-y-1.5">
          {Object.entries(TCG_CONFIG).map(([key, config]) => {
            const tcg = key as TCGType;
            const isActive = activeTcgTypes.includes(tcg);
            return (
              <button
                key={tcg}
                onClick={() => toggleTcgType(tcg)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  isActive
                    ? `${config.bgColor} ${config.color} font-medium`
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span aria-hidden>{config.emoji}</span>
                {config.labelShort}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("formatLabel")}</label>
        <div className="space-y-1.5">
          {Object.entries(EVENT_FORMAT_LABELS).map(([key, label]) => {
            const format = key as EventFormat;
            const isActive = activeFormats.includes(format);
            return (
              <button
                key={format}
                onClick={() => toggleFormat(format)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-sm text-left transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Country — grouped so GB/UK is visible, same chip style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("countryLabel")}</label>
        <div className="space-y-4">
          {countrySections.map((section) => (
            <div key={section.id} className="space-y-1.5">
              <p className="px-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                {ts(section.id)}
              </p>
              {section.codes.map((code) => {
                const isActive = activeCountry === code;
                return (
                  <button
                    key={code}
                    onClick={() => navigateWithFilter({ pays: isActive ? null : code })}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-sm text-left transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {tc.has(code) ? tc(code) : code}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Free only */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={activeFreeOnly}
            onChange={(e) => navigateWithFilter({ gratuit: e.target.checked ? "1" : null })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{t("freeOnlyLabel")}</span>
        </label>
      </div>
    </aside>
  );
}
