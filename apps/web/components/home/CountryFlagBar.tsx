import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { countryFlagEmoji } from "@/lib/countries";
import { countryPathSlug } from "@/lib/geo-slugs";
import { eventsBasePath } from "@/lib/paths";

/**
 * Top European countries shown as flag pills on the homepage.
 * Order: by event count descending (hardcoded top-12 to avoid a Sanity
 * aggregation query on every homepage hit — the ranking barely changes).
 */
const TOP_COUNTRIES = [
  "GB", "NL", "BE", "FR", "DE", "ES", "FI", "PT", "NO", "DK", "IE", "SE",
];

const PILL_ROTATIONS = [
  "-rotate-1", "rotate-1", "-rotate-2", "rotate-1",
  "-rotate-1", "rotate-2", "-rotate-1", "rotate-1",
  "rotate-2", "-rotate-1", "rotate-1", "-rotate-2",
];

export async function CountryFlagBar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "countries" });
  const eventsRoot = eventsBasePath(locale);

  return (
    <section className="border-b-4 border-black bg-[#FAFAF7] py-5">
      <div className="container">
        <div className="flex flex-wrap gap-2.5 justify-center items-center">
          {TOP_COUNTRIES.map((code, i) => (
            <Link
              key={code}
              href={`${eventsRoot}/${countryPathSlug(code, locale)}`}
              prefetch={false}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold border-2 border-black bg-white shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${PILL_ROTATIONS[i % PILL_ROTATIONS.length]}`}
            >
              <span className="text-base leading-none">{countryFlagEmoji(code)}</span>
              {tc(code).split(" ").slice(1).join(" ")}
            </Link>
          ))}

          {/* "All countries" pill */}
          <Link
            href={eventsRoot}
            prefetch={false}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold border-2 border-black bg-[#FFDE03] shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            🌍 {t("allCountriesPill")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
