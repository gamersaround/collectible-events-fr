"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Map, PlusCircle, BookOpen, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { eventsBasePath } from "@/lib/paths";

function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const otherLocale = locale === "fr" ? "en" : "fr";

  return (
    <button
      onClick={() => router.replace(pathname, { locale: otherLocale })}
      className="flex items-center gap-1 px-3 py-1.5 font-black uppercase text-xs border-2 border-black hover:bg-black hover:text-[#FFDE03] transition-colors"
      title={t("switchLanguage")}
    >
      {locale === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const eventsHref = eventsBasePath(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-[#FFDE03]">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight text-black"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.jpg"
            alt="CardAgenda"
            width={44}
            height={44}
            className="rounded-sm"
            priority
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href={eventsHref}
            className="flex items-center gap-1.5 px-4 py-2 font-bold uppercase text-sm text-black hover:bg-black hover:text-[#FFDE03] transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            {t("events")}
          </Link>
          <Link
            href="/carte"
            className="flex items-center gap-1.5 px-4 py-2 font-bold uppercase text-sm text-black hover:bg-black hover:text-[#FFDE03] transition-colors"
          >
            <Map className="h-4 w-4" />
            {t("map")}
          </Link>
          <Link
            href="/articles"
            className="flex items-center gap-1.5 px-4 py-2 font-bold uppercase text-sm text-black hover:bg-black hover:text-[#FFDE03] transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            {t("blog")}
          </Link>
          <Link
            href="/soumettre"
            className="flex items-center gap-1.5 ml-2 bg-black text-[#FFDE03] px-4 py-2 font-bold uppercase text-sm border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            {t("submit")}
          </Link>
          <div className="ml-2">
            <LocaleSwitcher />
          </div>
        </nav>

        {/* Burger button + mobile locale switcher */}
        <div className="md:hidden flex items-center gap-2">
          <LocaleSwitcher />
          <button
            className="p-2 text-black font-bold border-2 border-black hover:bg-black hover:text-[#FFDE03] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t-4 border-black bg-[#FFDE03]">
          <nav className="container flex flex-col py-2">
            <Link
              href={eventsHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2 py-3 font-bold uppercase text-sm border-b-2 border-black/20 hover:bg-black hover:text-[#FFDE03] transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
              {t("events")}
            </Link>
            <Link
              href="/carte"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2 py-3 font-bold uppercase text-sm border-b-2 border-black/20 hover:bg-black hover:text-[#FFDE03] transition-colors"
            >
              <Map className="h-4 w-4" />
              {t("map")}
            </Link>
            <Link
              href="/articles"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2 py-3 font-bold uppercase text-sm border-b-2 border-black/20 hover:bg-black hover:text-[#FFDE03] transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              {t("blog")}
            </Link>
            <Link
              href="/soumettre"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 mt-2 mb-1 bg-black text-[#FFDE03] px-4 py-3 font-bold uppercase text-sm border-2 border-black shadow-brutal"
            >
              <PlusCircle className="h-4 w-4" />
              {t("submit")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
