"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isEventLiked,
  LIKES_CHANGED_EVENT,
  toggleEventLike,
} from "@/lib/likes";

export function useEventLike(eventId: string) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const sync = () => setLiked(isEventLiked(eventId));
    sync();
    window.addEventListener(LIKES_CHANGED_EVENT, sync);
    return () => window.removeEventListener(LIKES_CHANGED_EVENT, sync);
  }, [eventId]);

  const toggle = useCallback(() => {
    setLiked(toggleEventLike(eventId));
  }, [eventId]);

  return { liked, toggle };
}
