import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Euro,
  Users,
  ExternalLink,
  ArrowLeft,
  Mail,
  Globe,
} from "lucide-react";
import { getEventBySlug, getAllEventSlugs } from "@/lib/queries/events";
import { urlFor } from "@/lib/sanity/image";
import { EventBadge, FormatBadge } from "@/components/events/EventBadge";
import { EventSchema } from "@/components/events/EventSchema";
import {
  formatEventDateRange,
  formatDateFr,
  formatEntryFee,
} from "@/lib/utils/dates";
import { TCGType } from "@agenda-cartes/shared";

// ISR: revalidate every hour, on-demand via webhook
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Événement introuvable" };

  return {
    title: event.title,
    description: event.description ?? `${event.title} — ${event.city}, ${formatDateFr(event.starts_at)}`,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      type: "website",
      images: event.image
        ? [{ url: urlFor(event.image).width(1200).height(630).auto("format").url() }]
        : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const isCancelled = event.status === "annule";

  return (
    <>
      <EventSchema event={event} />

      <div className="container py-8 max-w-4xl">
        {/* Back link */}
        <Link
          href="/evenements"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux événements
        </Link>

        {/* Hero image */}
        {event.image && (
          <div className="relative h-56 md:h-80 w-full rounded-xl overflow-hidden border-2 border-black mb-8">
            <Image
              src={urlFor(event.image).width(1200).height(400).auto("format").url()}
              alt={event.image.alt ?? event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <article>
          {/* Header */}
          <header className="mb-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tcg_types.map((tcg) => (
                <EventBadge key={tcg} tcgType={tcg as TCGType} />
              ))}
              <FormatBadge format={event.format} />
              {isCancelled && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                  Annulé
                </span>
              )}
            </div>

            <h1 className={`text-3xl font-bold text-gray-900 mb-3 ${isCancelled ? "line-through opacity-60" : ""}`}>
              {event.title}
            </h1>

            {event.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {event.description}
              </p>
            )}
          </header>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date & time */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                <Calendar className="h-5 w-5" />
                Date et horaires
              </div>
              <p className="text-gray-900 font-medium">
                {formatEventDateRange(event.starts_at, event.ends_at)}
              </p>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                <MapPin className="h-5 w-5" />
                Lieu
              </div>
              {event.venue_name && (
                <p className="font-medium text-gray-900">{event.venue_name}</p>
              )}
              {event.address && (
                <p className="text-gray-600 text-sm">{event.address}</p>
              )}
              <p className="text-gray-700">
                {event.postal_code && `${event.postal_code} `}
                <span className="font-medium">{event.city}</span>
              </p>
              {event.latitude && event.longitude && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline"
                >
                  Voir sur la carte
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Entry fee */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                <Euro className="h-5 w-5" />
                Tarif
              </div>
              <p className={`font-medium text-lg ${event.entry_fee === null || event.entry_fee === 0 ? "text-green-600" : "text-gray-900"}`}>
                {formatEntryFee(event.entry_fee)}
              </p>
              {event.max_participants && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                  <Users className="h-4 w-4" />
                  {event.max_participants} places maximum
                </p>
              )}
            </div>

            {/* Organizer */}
            {(event.organizer_name || event.organizer_contact || event.website_url) && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                  <Users className="h-5 w-5" />
                  Organisateur
                </div>
                {event.organizer_name && (
                  <p className="font-medium text-gray-900">{event.organizer_name}</p>
                )}
                {event.organizer_contact && (
                  <a
                    href={`mailto:${event.organizer_contact}`}
                    className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {event.organizer_contact}
                  </a>
                )}
                {event.website_url && (
                  <a
                    href={event.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Site web
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Registration CTA */}
          {event.registration_url && !isCancelled && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <h2 className="font-semibold text-blue-900 mb-2">Inscription</h2>
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                S'inscrire à l'événement
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Source attribution */}
          {event.source_url && (
            <div className="mt-6 text-center text-sm text-gray-400">
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600"
              >
                Source originale
              </a>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
