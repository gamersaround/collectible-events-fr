import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { eventsBasePath } from "@/lib/paths";

export async function Footer() {
  const t = await getTranslations("footer");
  const tt = await getTranslations("tcgLabelsFull");
  const locale = await getLocale();
  const eventsRoot = eventsBasePath(locale);

  return (
    <footer className="border-t-4 border-black bg-black text-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b-2 border-white/20 pb-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Image
                src="/logo.jpg"
                alt="CardAgenda"
                width={80}
                height={80}
                className="rounded-sm"
              />
            </div>
            <p className="text-sm text-white/60 font-medium">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-black uppercase text-[#FFDE03] mb-3 text-sm tracking-wide">{t("navigationTitle")}</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href={eventsRoot} className="text-white/70 hover:text-[#FFDE03] transition-colors">{t("allEvents")}</Link></li>
              <li><Link href="/carte" className="text-white/70 hover:text-[#FFDE03] transition-colors">{t("interactiveMap")}</Link></li>
              <li><Link href="/soumettre" className="text-white/70 hover:text-[#FFDE03] transition-colors">{t("submitEvent")}</Link></li>
              <li><Link href="/sponsoriser" className="text-white/70 hover:text-[#FFDE03] transition-colors">{t("sponsorLink")}</Link></li>
            </ul>
          </div>

          {/* TCG types — dedicated landing pages for SEO */}
          <div>
            <h3 className="font-display font-black uppercase text-[#FFDE03] mb-3 text-sm tracking-wide">{t("gamesTitle")}</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href={`${eventsRoot}/pokemon`} className="text-white/70 hover:text-[#FFDE03] transition-colors">⚡ {tt("pokemon")}</Link></li>
              <li><Link href={`${eventsRoot}/magic`} className="text-white/70 hover:text-[#FFDE03] transition-colors">✨ {tt("magic")}</Link></li>
              <li><Link href={`${eventsRoot}/yugioh`} className="text-white/70 hover:text-[#FFDE03] transition-colors">🃏 {tt("yugioh")}</Link></li>
              <li><Link href={`${eventsRoot}/sports-cards`} className="text-white/70 hover:text-[#FFDE03] transition-colors">⚽ {tt("sports_cards")}</Link></li>
              <li><Link href={`${eventsRoot}/one-piece`} className="text-white/70 hover:text-[#FFDE03] transition-colors">🏴‍☠️ {tt("one_piece")}</Link></li>
              <li><Link href={`${eventsRoot}/lorcana`} className="text-white/70 hover:text-[#FFDE03] transition-colors">🌊 {tt("lorcana")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-sm font-bold text-white/40 uppercase tracking-widest">
          {t("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
