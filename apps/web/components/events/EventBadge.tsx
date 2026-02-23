"use client";

import { useTranslations } from "next-intl";
import { TCG_CONFIG, TCGType } from "@agenda-cartes/shared";
import { cn } from "@/lib/utils/cn";

interface EventBadgeProps {
  tcgType: TCGType;
  size?: "sm" | "md";
  className?: string;
}

// Small rotation per type for the sticker effect
const BADGE_ROTATIONS: Partial<Record<TCGType, string>> = {
  [TCGType.POKEMON]: "-rotate-1",
  [TCGType.MAGIC]: "rotate-1",
  [TCGType.YUGIOH]: "-rotate-2",
  [TCGType.SPORTS_CARDS]: "rotate-1",
  [TCGType.ONE_PIECE]: "-rotate-1",
  [TCGType.DRAGON_BALL]: "rotate-2",
  [TCGType.LORCANA]: "-rotate-1",
  [TCGType.FLESH_BLOOD]: "rotate-1",
  [TCGType.AUTRES]: "rotate-0",
};

export function EventBadge({ tcgType, size = "md", className }: EventBadgeProps) {
  const config = TCG_CONFIG[tcgType];
  const rotation = BADGE_ROTATIONS[tcgType] ?? "rotate-0";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border border-black font-bold",
        config.bgColor,
        config.color,
        rotation,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span aria-hidden>{config.emoji}</span>
      {config.labelShort}
    </span>
  );
}

interface FormatBadgeProps {
  format: string;
  className?: string;
}

const FORMAT_STYLES: Record<string, string> = {
  tournoi: "bg-blue-100 text-blue-900 border-blue-900",
  bourse: "bg-green-100 text-green-900 border-green-900",
  convention: "bg-purple-100 text-purple-900 border-purple-900",
  draft: "bg-orange-100 text-orange-900 border-orange-900",
  prereleases: "bg-pink-100 text-pink-900 border-pink-900",
  league: "bg-cyan-100 text-cyan-900 border-cyan-900",
  casual: "bg-gray-100 text-gray-800 border-gray-800",
  championship: "bg-yellow-100 text-yellow-900 border-yellow-900",
};

const KNOWN_FORMATS = ["tournoi", "bourse", "convention", "draft", "prereleases", "league", "casual", "championship"] as const;
type KnownFormat = (typeof KNOWN_FORMATS)[number];

function isKnownFormat(f: string): f is KnownFormat {
  return (KNOWN_FORMATS as readonly string[]).includes(f);
}

export function FormatBadge({ format, className }: FormatBadgeProps) {
  const t = useTranslations("formatLabels");
  const style = FORMAT_STYLES[format] ?? "bg-gray-100 text-gray-800 border-gray-800";
  const label = isKnownFormat(format) ? t(format) : format;

  return (
    <span
      className={cn(
        "inline-flex items-center border font-bold text-[10px] px-1.5 py-0.5 rotate-1",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
