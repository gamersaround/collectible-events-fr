"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Euro, Users } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { EventRow } from "@/lib/queries/events";
import { EventBadge, FormatBadge } from "./EventBadge";
import { formatDateFr, formatEntryFee } from "@/lib/utils/dates";
import { TCG_CONFIG, TCGType } from "@agenda-cartes/shared";
import { urlFor } from "@/lib/sanity/image";

interface EventCardProps {
  event: EventRow;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.starts_at);
  const day = startDate.getDate();
  const month = startDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const primaryTcg = event.tcg_types[0] as TCGType | undefined;
  const remainingTcgs = event.tcg_types.slice(1);

  return (
    <motion.article
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-shadow duration-150 hover:z-10 will-change-transform"
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
          <div className="relative h-36 w-full border-b-2 border-black overflow-hidden shrink-0">
            <Image
              src={urlFor(event.image).width(480).height(144).auto("format").url()}
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
            {/* Badges — remaining TCGs + format */}
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
              <div className="flex items-center gap-1.5 text-xs font-medium text-black/70">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {event.city}
                  {event.department_code && (
                    <span className="text-black/40 ml-1">({event.department_code})</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Euro className="h-3 w-3 shrink-0 text-black/70" />
                <span className={event.entry_fee === null || event.entry_fee === 0 ? "text-green-700 font-bold" : "text-black/70"}>
                  {formatEntryFee(event.entry_fee)}
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
      </Link>
    </motion.article>
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
