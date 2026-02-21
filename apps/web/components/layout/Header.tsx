import Link from "next/link";
import { CalendarDays, Map, PlusCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-[#FFDE03]">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight text-black">
          <span className="text-2xl inline-block -rotate-6">🃏</span>
          <span>CardAgenda</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/evenements"
            className="flex items-center gap-1.5 px-4 py-2 font-bold uppercase text-sm text-black hover:bg-black hover:text-[#FFDE03] transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            Événements
          </Link>
          <Link
            href="/carte"
            className="flex items-center gap-1.5 px-4 py-2 font-bold uppercase text-sm text-black hover:bg-black hover:text-[#FFDE03] transition-colors"
          >
            <Map className="h-4 w-4" />
            Carte
          </Link>
          <Link
            href="/soumettre"
            className="flex items-center gap-1.5 ml-2 bg-black text-[#FFDE03] px-4 py-2 font-bold uppercase text-sm border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Soumettre
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-black font-bold border-2 border-black hover:bg-black hover:text-[#FFDE03] transition-colors" aria-label="Menu">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
