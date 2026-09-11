"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { TCGType, TCG_CONFIG, EventFormat, EVENT_FORMAT_LABELS } from "@agenda-cartes/shared";
import { cn } from "@/lib/utils/cn";
import { countrySectionsFor } from "@/lib/countries";
import { countryCodeFromSlug, countryPathSlug } from "@/lib/geo-slugs";
import { eventsBasePath } from "@/lib/paths";

export function EventFilters({ countries }: { countries?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("filters");
  const tc = useTranslations("countries");
  const tf = useTranslations("formatLabels");
  const tt = useTranslations("tcgLabels");
  const eventsRoot = eventsBasePath(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelId = useId();
  const countrySections = countrySectionsFor(countries);
  const pathSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  const countryFromPath = countryCodeFromSlug(pathSegment);

  const sectionLabel = (id: string) => {
    switch (id) {
      case "france":
        return t("countrySections.france");
      case "uk":
        return t("countrySections.uk");
      case "benelux":
        return t("countrySections.benelux");
      case "dach":
        return t("countrySections.dach");
      case "south":
        return t("countrySections.south");
      case "north":
        return t("countrySections.north");
      case "central":
        return t("countrySections.central");
      default:
        return t("countrySections.other");
    }
  };

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
  const activeCountry = searchParams.get("pays") ?? countryFromPath ?? "";
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

  const activeCount =
    activeTcgTypes.length +
    activeFormats.length +
    (activeCountry !== "" ? 1 : 0) +
    (activeSearch !== "" ? 1 : 0) +
    (activeFreeOnly ? 1 : 0);
  const hasActiveFilters = activeCount > 0;

  return (
    <aside>
      <button
        type="button"
        className="md:hidden flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        aria-controls={panelId}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {t("title")}
          {activeCount > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-medium text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-gray-500 transition-transform", mobileOpen && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        className={cn("space-y-6", mobileOpen ? "mt-4 block md:mt-0" : "hidden md:mt-0 md:block")}
      >
      {/* Header */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal className="h-4 w-4" />
          {t("title")}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <X className="h-3 w-3" />
            {t("clearAll")}
          </button>
        )}
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="md:hidden flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
        >
          <X className="h-3 w-3" />
          {t("clearAll")}
        </button>
      )}

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
                {tt(tcg)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("formatLabel")}</label>
        <div className="space-y-1.5">
          {Object.keys(EVENT_FORMAT_LABELS).map((key) => {
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
                {tf(format)}
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
                {sectionLabel(section.id)}
              </p>
              {section.codes.map((code) => {
                const isActive = activeCountry === code;
                return (
                  <Link
                    key={code}
                    href={isActive ? eventsRoot : `${eventsRoot}/${countryPathSlug(code, locale)}`}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-sm text-left transition-colors block",
                      isActive
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {tc(code)}
                  </Link>
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
      </div>
    </aside>
  );
}
