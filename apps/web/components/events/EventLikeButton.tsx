"use client";

import { ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEventLike } from "@/hooks/useEventLike";
import { cn } from "@/lib/utils/cn";

interface EventLikeButtonProps {
  eventId: string;
  variant?: "compact" | "detail";
  className?: string;
}

export function EventLikeButton({
  eventId,
  variant = "compact",
  className,
}: EventLikeButtonProps) {
  const t = useTranslations("likes");
  const { liked, toggle } = useEventLike(eventId);

  const label = liked ? t("unlike") : t("like");

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={liked}
        aria-label={label}
        className={cn(
          "inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-display text-sm font-black uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] transition-colors",
          liked ? "bg-[#FFDE03] text-black" : "bg-white text-black hover:bg-[#FFDE03]",
          className
        )}
      >
        <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
        {liked ? t("liked") : t("like")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-pressed={liked}
      aria-label={label}
      className={cn(
        "absolute top-2 left-2 z-30 flex h-8 w-8 items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors",
        liked ? "bg-[#FFDE03] text-black" : "bg-white text-black hover:bg-[#FFDE03]",
        className
      )}
    >
      <ThumbsUp className={cn("h-3.5 w-3.5", liked && "fill-current")} />
    </button>
  );
}
