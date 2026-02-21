import { TCG_CONFIG, TCGType } from "@agenda-cartes/shared";
import { cn } from "@/lib/utils/cn";

interface EventBadgeProps {
  tcgType: TCGType;
  size?: "sm" | "md";
  className?: string;
}

export function EventBadge({ tcgType, size = "md", className }: EventBadgeProps) {
  const config = TCG_CONFIG[tcgType];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        config.bgColor,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
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

const FORMAT_COLORS: Record<string, string> = {
  tournoi: "bg-blue-100 text-blue-800",
  bourse: "bg-green-100 text-green-800",
  convention: "bg-purple-100 text-purple-800",
  draft: "bg-orange-100 text-orange-800",
  prereleases: "bg-pink-100 text-pink-800",
  league: "bg-cyan-100 text-cyan-800",
  casual: "bg-gray-100 text-gray-700",
  championship: "bg-yellow-100 text-yellow-800",
};

const FORMAT_LABELS: Record<string, string> = {
  tournoi: "Tournoi",
  bourse: "Bourse",
  convention: "Convention",
  draft: "Draft",
  prereleases: "Prélancement",
  league: "Ligue",
  casual: "Casual",
  championship: "Championnat",
};

export function FormatBadge({ format, className }: FormatBadgeProps) {
  const color = FORMAT_COLORS[format] ?? "bg-gray-100 text-gray-700";
  const label = FORMAT_LABELS[format] ?? format;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        color,
        className
      )}
    >
      {label}
    </span>
  );
}
