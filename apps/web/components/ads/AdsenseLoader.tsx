"use client";

/**
 * AdsenseLoader — injecte le script Auto Ads uniquement sur les pages
 * monétisables. Pages exclues : formulaires, légales, 404.
 *
 * Formats Auto Ads autorisés dans l'UI AdSense :
 *   ✅ In-article (guides uniquement)
 *   ✅ In-page (curseur expérience page, pas max revenus)
 *   ❌ Vignettes (interstitiel plein écran)  — à désactiver dans UI AdSense
 *   ❌ Overlays d'ancre                      — idem
 *   ❌ In-feed                               — casse la grille d'events
 *   ❌ Offerwalls                            — bloque le contenu
 */

import Script from "next/script";
import { usePathname } from "next/navigation";

const ADSENSE_CLIENT = "ca-pub-8480412242622897";

/**
 * Segments de path (sans locale) où les pubs sont exclues.
 * Exemple : "/fr/soumettre" → segment "soumettre" → exclu.
 */
const EXCLUDED_SEGMENTS = [
  "soumettre",    // formulaire de soumission
  "contact",      // formulaire de contact
  "mentions-legales",
  "legal",
  "confidentialite",
  "privacy",
  "cookies",
  "a-propos",
  "about",
  "sponsoriser",  // page sponsor — pas mélanger avec pubs Google
];

export function AdsenseLoader() {
  const pathname = usePathname();

  // Extraire les segments après la locale (/fr/xxx → ["xxx", ...])
  const segments = pathname.split("/").filter(Boolean).slice(1);

  const isExcluded = segments.some((seg) => EXCLUDED_SEGMENTS.includes(seg));

  if (isExcluded) return null;

  return (
    <Script
      id="adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
