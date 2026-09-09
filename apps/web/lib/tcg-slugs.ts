/** Clean URL slugs → TCGType enum. Used by /evenements/[slug] landings + sitemap. */
export const TCG_SLUG_MAP: Record<string, string> = {
  pokemon: "pokemon",
  magic: "magic",
  yugioh: "yugioh",
  "sports-cards": "sports_cards",
  "one-piece": "one_piece",
  "dragon-ball": "dragon_ball",
  lorcana: "lorcana",
  "flesh-blood": "flesh_blood",
  autres: "autres",
};

export const TCG_LANDING_SLUGS = Object.keys(TCG_SLUG_MAP);
