import Link from "next/link";
import { ArrowRight, CalendarDays, Map, PlusCircle, TrendingUp } from "lucide-react";
import { getEvents } from "@/lib/queries/events";
import { EventCard } from "@/components/events/EventCard";
import { TCG_CONFIG, TCGType } from "@agenda-cartes/shared";

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const { data: upcomingEvents } = await getEvents({}, 1, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="container text-center">
          <div className="text-6xl mb-6">🃏</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agenda Cartes FR
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Le répertoire de référence des événements de cartes à collectionner
            en France. Tournois, bourses, conventions — tout en un seul endroit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <CalendarDays className="h-5 w-5" />
              Voir tous les événements
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/carte"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              <Map className="h-5 w-5" />
              Carte interactive
            </Link>
          </div>
        </div>
      </section>

      {/* TCG Type Pills */}
      <section className="border-b bg-gray-50 py-4">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(TCG_CONFIG).map(([key, config]) => (
              <Link
                key={key}
                href={`/evenements?tcg=${key}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity`}
              >
                <span>{config.emoji}</span>
                {config.labelShort}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Prochains événements
              </h2>
              <p className="text-gray-500 mt-1">Les événements TCG à venir en France</p>
            </div>
            <Link
              href="/evenements"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Aucun événement pour le moment. Soyez le premier à en ajouter un !</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA: Submit event */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 text-center max-w-2xl mx-auto">
            <PlusCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Organisez un événement ?
            </h2>
            <p className="text-gray-600 mb-6">
              Soumettez votre tournoi, bourse ou convention pour le faire
              apparaître dans notre annuaire. Modération sous 24h.
            </p>
            <Link
              href="/soumettre"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Soumettre un événement
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-10 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">9+</div>
              <div className="text-sm text-gray-500 mt-1">Jeux référencés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">101</div>
              <div className="text-sm text-gray-500 mt-1">Départements couverts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">🔄</div>
              <div className="text-sm text-gray-500 mt-1">Mise à jour auto (6h)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">🆓</div>
              <div className="text-sm text-gray-500 mt-1">100% gratuit</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
