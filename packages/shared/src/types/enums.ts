// ============================================================
// Source of truth for all TCG/event enums
// Used by both web app and crawler
// To add a new TCG type:
//   1. Add to TCGType enum here
//   2. Add to TCG_CONFIG below
//   3. Add to tcg_type PostgreSQL enum in migration SQL
// ============================================================

export enum TCGType {
  POKEMON = "pokemon",
  MAGIC = "magic",
  YUGIOH = "yugioh",
  SPORTS_CARDS = "sports_cards",
  ONE_PIECE = "one_piece",
  DRAGON_BALL = "dragon_ball",
  LORCANA = "lorcana",
  FLESH_BLOOD = "flesh_blood",
  AUTRES = "autres",
}

export enum EventFormat {
  TOURNOI = "tournoi",
  BOURSE = "bourse",
  CONVENTION = "convention",
  DRAFT = "draft",
  PRERELEASES = "prereleases",
  LEAGUE = "league",
  CASUAL = "casual",
  CHAMPIONSHIP = "championship",
}

export enum EventStatus {
  A_VENIR = "a_venir",
  EN_COURS = "en_cours",
  TERMINE = "termine",
  ANNULE = "annule",
}

export enum SubmissionStatus {
  EN_ATTENTE = "en_attente",
  APPROUVE = "approuve",
  REJETE = "rejete",
  DOUBLON = "doublon",
}

export enum SourceType {
  OFFICIAL_API = "official_api",
  GENERIC_HTML = "generic_html",
  ICAL = "ical",
  RSS = "rss",
}

// Display config for each TCG type
export interface TCGConfig {
  label: string;
  labelShort: string;
  color: string;        // Tailwind color class
  bgColor: string;      // Tailwind bg class
  emoji: string;
  markerColor: string;  // Hex for Leaflet markers
}

export const TCG_CONFIG: Record<TCGType, TCGConfig> = {
  [TCGType.POKEMON]: {
    label: "Pokémon TCG",
    labelShort: "Pokémon",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    emoji: "⚡",
    markerColor: "#FBBF24",
  },
  [TCGType.MAGIC]: {
    label: "Magic: The Gathering",
    labelShort: "Magic",
    color: "text-amber-800",
    bgColor: "bg-amber-100",
    emoji: "✨",
    markerColor: "#92400E",
  },
  [TCGType.YUGIOH]: {
    label: "Yu-Gi-Oh!",
    labelShort: "Yu-Gi-Oh",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    emoji: "🃏",
    markerColor: "#7C3AED",
  },
  [TCGType.SPORTS_CARDS]: {
    label: "Cartes sportives",
    labelShort: "Sports",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    emoji: "⚽",
    markerColor: "#1D4ED8",
  },
  [TCGType.ONE_PIECE]: {
    label: "One Piece Card Game",
    labelShort: "One Piece",
    color: "text-red-700",
    bgColor: "bg-red-100",
    emoji: "🏴‍☠️",
    markerColor: "#B91C1C",
  },
  [TCGType.DRAGON_BALL]: {
    label: "Dragon Ball Super CG",
    labelShort: "Dragon Ball",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    emoji: "🐉",
    markerColor: "#C2410C",
  },
  [TCGType.LORCANA]: {
    label: "Disney Lorcana",
    labelShort: "Lorcana",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    emoji: "🌊",
    markerColor: "#4338CA",
  },
  [TCGType.FLESH_BLOOD]: {
    label: "Flesh and Blood",
    labelShort: "Flesh & Blood",
    color: "text-rose-700",
    bgColor: "bg-rose-100",
    emoji: "⚔️",
    markerColor: "#BE123C",
  },
  [TCGType.AUTRES]: {
    label: "Autres TCG",
    labelShort: "Autres",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    emoji: "🎴",
    markerColor: "#374151",
  },
};

export const EVENT_FORMAT_LABELS: Record<EventFormat, string> = {
  [EventFormat.TOURNOI]: "Tournoi",
  [EventFormat.BOURSE]: "Bourse / Vide-greniers",
  [EventFormat.CONVENTION]: "Convention",
  [EventFormat.DRAFT]: "Draft",
  [EventFormat.PRERELEASES]: "Prélancement",
  [EventFormat.LEAGUE]: "Ligue",
  [EventFormat.CASUAL]: "Casual / Soirée",
  [EventFormat.CHAMPIONSHIP]: "Championnat",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.A_VENIR]: "À venir",
  [EventStatus.EN_COURS]: "En cours",
  [EventStatus.TERMINE]: "Terminé",
  [EventStatus.ANNULE]: "Annulé",
};
