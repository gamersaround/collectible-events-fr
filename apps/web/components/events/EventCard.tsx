"use client";

import { useRef } from "react";
import Image from "next/image";
import { MapPin, Euro, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EventRow } from "@/lib/queries/events";
import { EventBadge, FormatBadge } from "./EventBadge";
import { formatDateFr, formatEntryFee } from "@/lib/utils/dates";
import { TCG_CONFIG, TCGType } from "@agenda-cartes/shared";
import { urlFor } from "@/lib/sanity/image";
import { countryCode } from "@/lib/countries";

interface EventCardProps {
  event: EventRow;
}

export function EventCard({ event }: EventCardProps) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("form");
  const tc = useTranslations("countries");
  const code = countryCode(event.country);
  const countryLabel = tc.has(code) ? tc(code) : code;

  const startDate = new Date(event.starts_at);
  const day = startDate.getDate();
  const month = startDate
    .toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { month: "short" })
    .toUpperCase();

  const cardRef = useRef<HTMLElement>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const el = cardRef.current;
    if (!el) return;
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    el.style.willChange = "transform";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = "box-shadow 150ms, transform 0s";
    el.style.transform = `perspective(800px) rotateX(${ny * -12}deg) rotateY(${nx * 12}deg)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "box-shadow 150ms, transform 350ms ease-out";
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    // Release the compositor layer after the return animation completes
    leaveTimerRef.current = setTimeout(() => {
      if (el) el.style.willChange = "auto";
    }, 400);
  };

  const primaryTcg = (event.primary_tcg_type ?? event.tcg_types[0]) as TCGType | undefined;
  const remainingTcgs = event.tcg_types.slice(1);
  const ratio = event.tcg_sports_ratio;

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-shadow duration-150 hover:z-10"
    >
      {/* Circular TCG seal badge */}
      {primaryTcg && (() => {
        const cfg = TCG_CONFIG[primaryTcg];
        return (
          <div className={`absolute -top-3 -right-3 z-10 w-11 h-11 rounded-full border-[3px] border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000] ${cfg.bgColor}`}>
            {cfg.emoji}
          </div>
        );
      })()}

      <Link href={`/evenements/${event.slug}`} className="flex flex-col h-full">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
        </div>

        {/* Banner image */}
        {event.image && (
          <div className="relative w-full border-b-2 border-black overflow-hidden shrink-0" style={{ aspectRatio: "2/1" }}>
            <Image
              src={urlFor(event.image).width(480).height(240).fit("crop").auto("format").url()}
              alt={event.image.alt ?? event.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 480px"
            />
          </div>
        )}

        {/* Row: date + content */}
        <div className="flex flex-1">
          {/* Date block */}
          <div className="bg-[#FFDE03] border-r-2 border-black flex flex-col items-center justify-center px-3 py-4 min-w-[56px] shrink-0">
            <span className="font-display text-3xl font-black leading-none text-black">{day}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-black mt-0.5">{month}</span>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              {remainingTcgs.map((tcg) => (
                <EventBadge key={tcg} tcgType={tcg as TCGType} size="sm" />
              ))}
              <FormatBadge format={event.format} />
            </div>

            {/* Title */}
            <h2 className="font-display font-black text-sm leading-snug mb-3 text-black uppercase line-clamp-2">
              {event.title}
            </h2>

            {/* Meta info */}
            <div className="space-y-1">
              <div className="flex items-start gap-1.5 text-xs font-medium text-black/70">
                <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                <span className="min-w-0">
                  <span className="block truncate">
                    {event.city}
                    {event.department_code && (
                      <span className="text-black/40 ml-1">({event.department_code})</span>
                    )}
                  </span>
                  <span className="block truncate text-[11px] font-semibold text-black/50">
                    {countryLabel}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Euro className="h-3 w-3 shrink-0 text-black/70" />
                <span className={event.entry_fee === null || event.entry_fee === 0 ? "text-green-700 font-bold" : "text-black/70"}>
                  {formatEntryFee(event.entry_fee, t("free"))}
                </span>
                {event.max_participants && (
                  <span className="flex items-center gap-0.5 ml-2 text-black/50">
                    <Users className="h-3 w-3" />
                    {event.max_participants} pl.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TCG / Sport ratio */}
        {typeof ratio === "number" && (
          <div className="border-t-2 border-black px-4 py-2 bg-white flex items-center justify-center gap-1.5">
            <span className="font-black text-[10px] uppercase tracking-widest text-black">{ratio}% TCG</span>
            <span className="font-black text-[10px] text-black/30">·</span>
            <span className="font-black text-[10px] uppercase tracking-widest text-blue-500">{100 - ratio}% SPORT</span>
          </div>
        )}
      </Link>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden animate-pulse flex">
      <div className="bg-[#FFDE03]/40 border-r-2 border-black min-w-[56px]" />
      <div className="p-4 flex-1">
        <div className="flex gap-1 mb-2">
          <div className="h-4 w-16 bg-gray-200 border border-black" />
          <div className="h-4 w-14 bg-gray-200 border border-black" />
        </div>
        <div className="h-4 bg-gray-200 mb-1" />
        <div className="h-4 bg-gray-100 w-4/5 mb-3" />
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-100 w-3/4" />
          <div className="h-3 bg-gray-100 w-1/2" />
        </div>
      </div>
    </div>
  );
}
