"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { citySlug } from "@/lib/geo-slugs";

interface CollapsibleCityListProps {
  cities: string[];
  eventsRoot: string;
  locale: string;
}

export function CollapsibleCityList({ cities, eventsRoot, locale }: CollapsibleCityListProps) {
  const [open, setOpen] = useState(false);
  const isFr = locale === "fr";

  return (
    <nav className="mb-8" aria-label={isFr ? "Villes" : "Cities"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
      >
        {isFr ? `${cities.length} villes` : `${cities.length} cities`}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="flex flex-wrap gap-2 mt-3">
          {cities.map((city) => (
            <li key={citySlug(city)}>
              <Link
                href={`${eventsRoot}/${citySlug(city)}`}
                className="inline-block px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {city}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
