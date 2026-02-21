import Link from "next/link";
import { CalendarDays, Map, PlusCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
          <span className="text-2xl">🃏</span>
          <span>Agenda Cartes FR</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/evenements"
            className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            Événements
          </Link>
          <Link
            href="/carte"
            className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Map className="h-4 w-4" />
            Carte
          </Link>
          <Link
            href="/soumettre"
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Soumettre un événement
          </Link>
        </nav>

        {/* Mobile menu button — simplified */}
        <button className="md:hidden p-2 text-gray-600" aria-label="Menu">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
