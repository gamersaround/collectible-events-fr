import Link from "next/link";
import Image from "next/image";

export function Footer() {
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
              Le répertoire des événements de cartes à collectionner.
              Pokémon, Magic, Yu-Gi-Oh, One Piece et plus.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-black uppercase text-[#FFDE03] mb-3 text-sm tracking-wide">Navigation</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="/evenements" className="text-white/70 hover:text-[#FFDE03] transition-colors">Tous les événements</Link></li>
              <li><Link href="/carte" className="text-white/70 hover:text-[#FFDE03] transition-colors">Carte interactive</Link></li>
              <li><Link href="/soumettre" className="text-white/70 hover:text-[#FFDE03] transition-colors">Soumettre un événement</Link></li>
            </ul>
          </div>

          {/* TCG types */}
          <div>
            <h3 className="font-display font-black uppercase text-[#FFDE03] mb-3 text-sm tracking-wide">Jeux</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="/evenements?tcg=pokemon" className="text-white/70 hover:text-[#FFDE03] transition-colors">⚡ Pokémon TCG</Link></li>
              <li><Link href="/evenements?tcg=magic" className="text-white/70 hover:text-[#FFDE03] transition-colors">✨ Magic: The Gathering</Link></li>
              <li><Link href="/evenements?tcg=yugioh" className="text-white/70 hover:text-[#FFDE03] transition-colors">🃏 Yu-Gi-Oh!</Link></li>
              <li><Link href="/evenements?tcg=one_piece" className="text-white/70 hover:text-[#FFDE03] transition-colors">🏴‍☠️ One Piece Card Game</Link></li>
              <li><Link href="/evenements?tcg=lorcana" className="text-white/70 hover:text-[#FFDE03] transition-colors">🌊 Disney Lorcana</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-sm font-bold text-white/40 uppercase tracking-widest">
          © {new Date().getFullYear()} CardAgenda — Made with ❤️ for the TCG community
        </div>
      </div>
    </footer>
  );
}
