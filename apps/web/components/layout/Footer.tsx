import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-blue-600 mb-3">
              <span>🃏</span>
              <span>Agenda Cartes FR</span>
            </div>
            <p className="text-sm text-gray-600">
              Le répertoire des événements de cartes à collectionner en France.
              Pokémon, Magic, Yu-Gi-Oh, One Piece et plus.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/evenements" className="hover:text-blue-600">Tous les événements</Link></li>
              <li><Link href="/carte" className="hover:text-blue-600">Carte interactive</Link></li>
              <li><Link href="/soumettre" className="hover:text-blue-600">Soumettre un événement</Link></li>
            </ul>
          </div>

          {/* TCG types */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Jeux</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/evenements?tcg=pokemon" className="hover:text-blue-600">⚡ Pokémon TCG</Link></li>
              <li><Link href="/evenements?tcg=magic" className="hover:text-blue-600">✨ Magic: The Gathering</Link></li>
              <li><Link href="/evenements?tcg=yugioh" className="hover:text-blue-600">🃏 Yu-Gi-Oh!</Link></li>
              <li><Link href="/evenements?tcg=one_piece" className="hover:text-blue-600">🏴‍☠️ One Piece Card Game</Link></li>
              <li><Link href="/evenements?tcg=lorcana" className="hover:text-blue-600">🌊 Disney Lorcana</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Agenda Cartes FR — Fait avec ❤️ pour la communauté TCG française</p>
        </div>
      </div>
    </footer>
  );
}
