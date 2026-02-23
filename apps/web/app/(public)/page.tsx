import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Map, PlusCircle } from "lucide-react";
import { getEvents } from "@/lib/queries/events";
import { EventCard } from "@/components/events/EventCard";
import { TCG_CONFIG } from "@agenda-cartes/shared";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CardAgenda — Agenda des événements cartes à collectionner",
  description:
    "Tous les événements cartes de collection en France et Belgique : tournois Pokémon, Magic the Gathering, Yu-Gi-Oh!, NBA, foot et bien plus. Gratuit, mis à jour en continu.",
  openGraph: {
    title: "CardAgenda — Agenda des événements cartes à collectionner",
    description:
      "Tournois, bourses et conventions de cartes à collectionner. Pokémon, Magic, NBA, Foot et plus.",
    images: [{ url: "/logo.jpg", width: 500, height: 500, alt: "CardAgenda" }],
  },
};

// Slight rotations for sticker effect
const STICKER_ROTATIONS = [
  "-rotate-2", "rotate-1", "-rotate-1", "rotate-2",
  "-rotate-3", "rotate-2", "-rotate-1", "rotate-1", "-rotate-2",
];

export default async function HomePage() {
  const { data: upcomingEvents } = await getEvents({}, 1, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#FFDE03] border-b-4 border-black py-12 md:py-20 px-4 relative overflow-hidden">
        {/* Decorative doodles */}
        <div className="absolute top-8 left-8 text-4xl opacity-20 rotate-12 select-none pointer-events-none">★</div>
        <div className="absolute bottom-8 right-12 text-5xl opacity-20 -rotate-12 select-none pointer-events-none">✦</div>
        <div className="absolute top-1/2 left-4 text-3xl opacity-15 rotate-6 select-none pointer-events-none">◆</div>
        <div className="absolute top-6 right-1/4 text-2xl opacity-15 -rotate-6 select-none pointer-events-none">●</div>

        <div className="container text-center relative z-10">
          {/* Big floating card emoji */}
          <div className="inline-block mb-8 bg-white border-4 border-black shadow-brutal-xl p-5 animate-float">
            <Image
              src="/logo.jpg"
              alt="CardAgenda"
              width={112}
              height={112}
              className="rounded-sm"
              priority
            />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-none mb-4 text-black">
            CardAgenda
          </h1>
          <p className="text-lg md:text-xl font-bold mb-10 max-w-2xl mx-auto text-black/80">
            Tous les événements cartes de collection, en un seul endroit.{" "}
            <span className="text-black/50">TCG · NBA · Foot · et bien plus.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 bg-black text-[#FFDE03] px-8 py-4 font-display font-black uppercase text-lg border-2 border-black shadow-[6px_6px_0px_0px_#000,3px_3px_0px_0px_#FFDE03] hover:shadow-[10px_10px_0px_0px_#000,5px_5px_0px_0px_#FFDE03] hover:-translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all"
            >
              <CalendarDays className="h-5 w-5" />
              Voir les événements
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/carte"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-display font-black uppercase text-lg border-2 border-black shadow-[6px_6px_0px_0px_#000,3px_3px_0px_0px_#FFDE03] hover:shadow-[10px_10px_0px_0px_#000,5px_5px_0px_0px_#FFDE03] hover:-translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all"
            >
              <Map className="h-5 w-5" />
              Carte interactive
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b-4 border-black bg-black py-3 select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[0, 1].map((i) => (
            <span key={i} className="text-[#FFDE03] font-display font-black uppercase text-sm tracking-widest pr-0">
              POKÉMON&nbsp;•&nbsp;MAGIC&nbsp;•&nbsp;YU-GI-OH&nbsp;•&nbsp;LORCANA&nbsp;•&nbsp;ONE&nbsp;PIECE&nbsp;•&nbsp;DRAGON&nbsp;BALL&nbsp;•&nbsp;FLESH&nbsp;&amp;&nbsp;BLOOD&nbsp;•&nbsp;NBA&nbsp;•&nbsp;FOOT&nbsp;•&nbsp;SPORTS&nbsp;CARDS&nbsp;•&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* TCG Sticker Pills */}
      <section className="border-b-4 border-black bg-white py-6">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {Object.entries(TCG_CONFIG).map(([key, config], i) => (
              <Link
                key={key}
                href={`/evenements?tcg=${key}`}
                prefetch={false}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${STICKER_ROTATIONS[i % STICKER_ROTATIONS.length]} ${config.bgColor} ${config.color}`}
              >
                <span>{config.emoji}</span>
                {config.labelShort}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-14">
        <div className="container">
          <div className="flex items-end justify-between mb-8 border-b-4 border-black pb-4">
            <div>
              <h2 className="font-display text-3xl font-black uppercase text-black">
                Prochains événements
              </h2>
              <p className="text-black/60 font-medium mt-1">Les événements à venir</p>
            </div>
            <Link
              href="/evenements"
              className="flex items-center gap-1 font-bold uppercase text-sm border-2 border-black px-4 py-2 shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="border-4 border-black border-dashed p-12 text-center">
              <p className="font-bold text-black/60">Aucun événement pour le moment. Soyez le premier à en ajouter un !</p>
            </div>
          )}
        </div>
      </section>

      {/* CardScanner.fr partner banner */}
      <section className="py-14 border-t-4 border-black bg-black">
        <div className="container">
          <div className="border-4 border-white shadow-[8px_8px_0px_0px_#FFDE03] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {/* Screenshot */}
            <div className="relative min-h-[240px] md:min-h-0 border-b-4 md:border-b-0 md:border-r-4 border-white overflow-hidden">
              <Image
                src="/cardscanner-preview.jpg"
                alt="CardScanner.fr — gérez votre collection"
                fill
                className="object-cover object-left-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div className="p-8 md:p-10 flex flex-col justify-center bg-black">
              <div className="inline-flex items-center gap-2 bg-[#FFDE03] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-5 w-fit border-2 border-white">
                🤝 Outil partenaire
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase leading-none mb-4 text-white">
                Gérez votre<br />collection
              </h2>
              <p className="text-white/70 font-medium mb-6 text-sm leading-relaxed">
                <span className="text-[#FFDE03] font-black">CardScanner.fr</span> — scannez vos cartes pour les identifier automatiquement,
                évaluez votre collection en temps réel et exportez vers eBay ou Whatnot en quelques clics.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["📷 Scan auto", "💶 Cote en direct", "📦 Collections", "🛒 Export eBay"].map((tag) => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-wider border-2 border-white/40 text-white/60 px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="https://cardscanner.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFDE03] text-black px-6 py-3 font-display font-black uppercase text-sm border-2 border-white shadow-[4px_4px_0px_0px_#fff] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all w-fit"
              >
                Découvrir CardScanner.fr
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA: Submit event */}
      <section className="py-14 border-t-4 border-black bg-white">
        <div className="container">
          <div className="border-4 border-black shadow-brutal-xl p-8 md:p-12 text-center max-w-2xl mx-auto bg-[#FFDE03]">
            <div className="text-6xl mb-4 inline-block rotate-3">📋</div>
            <h2 className="font-display text-3xl font-black uppercase mb-3 text-black">
              Organisez un événement ?
            </h2>
            <p className="font-medium mb-8 text-black/80">
              Soumettez votre tournoi, bourse ou convention.
              Modération sous 24h — 100% gratuit.
            </p>
            <Link
              href="/soumettre"
              className="inline-flex items-center gap-2 bg-black text-[#FFDE03] px-8 py-4 font-display font-black uppercase text-lg border-2 border-black shadow-brutal hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
            >
              <PlusCircle className="h-5 w-5" />
              Soumettre un événement
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12 border-t-4 border-black">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-black">
            {[
              { value: "9+", label: "Jeux référencés" },
              { value: "101", label: "Départements" },
              { value: "6h", label: "Mise à jour auto" },
              { value: "🆓", label: "100% gratuit" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-6 text-center ${i < 3 ? "border-r-2 border-black" : ""} ${i >= 2 ? "border-t-2 md:border-t-0 border-black" : ""}`}
              >
                <div className="font-display text-4xl font-black text-black">{stat.value}</div>
                <div className="text-sm font-bold text-black/60 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
