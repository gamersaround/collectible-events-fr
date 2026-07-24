import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");

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
              <li><Link href="/evenements" className="text-white/70 hover:text-[#FFDE03] transition-colors">{t("allEvents")}</Link></li>
              <li><Link href="/carte" className="text-white/70 hover:text-[#FFDE03] transition-colors">{t("interactiveMap")}</Link></li>
              <li><Link href="/soumettre" className="text-white/70 hover:text-[#FFDE03] transition-colors">{t("submitEvent")}</Link></li>
            </ul>
          </div>

          {/* TCG types — dedicated landing pages for SEO */}
          <div>
            <h3 className="font-display font-black uppercase text-[#FFDE03] mb-3 text-sm tracking-wide">{t("gamesTitle")}</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="/evenements/pokemon" className="text-white/70 hover:text-[#FFDE03] transition-colors">⚡ Pokémon TCG</Link></li>
              <li><Link href="/evenements/magic" className="text-white/70 hover:text-[#FFDE03] transition-colors">✨ Magic: The Gathering</Link></li>
              <li><Link href="/evenements/yugioh" className="text-white/70 hover:text-[#FFDE03] transition-colors">🃏 Yu-Gi-Oh!</Link></li>
              <li><Link href="/evenements/sports-cards" className="text-white/70 hover:text-[#FFDE03] transition-colors">⚽ Cartes Sportives</Link></li>
              <li><Link href="/evenements/one-piece" className="text-white/70 hover:text-[#FFDE03] transition-colors">🏴‍☠️ One Piece Card Game</Link></li>
              <li><Link href="/evenements/lorcana" className="text-white/70 hover:text-[#FFDE03] transition-colors">🌊 Disney Lorcana</Link></li>
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
