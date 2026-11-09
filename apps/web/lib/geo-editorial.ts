/**
 * Editorial copy and FAQ for country geo-landing pages.
 * Keys are ISO-2 country codes.
 * Only the 5 priority markets (FR, GB, BE, DE, NL) have full copy.
 * All others fall back to the generic description from geoPageCopy().
 */

export type FaqItem = { q: string; a: string };

export type CountryEditorialCopy = {
  intro: string; // 150-200 words, plain text
  faq: FaqItem[];
};

const GEO_EDITORIAL: Partial<Record<string, Record<string, CountryEditorialCopy>>> = {
  FR: {
    fr: {
      intro:
        "La France est l'un des marchés TCG les plus actifs d'Europe. Chaque week-end, des dizaines d'événements réunissent joueurs et collectionneurs dans toutes les grandes villes : Paris, Lille, Lyon, Toulouse, Bordeaux, Nice. Les bourses Pokémon et Magic dominent le calendrier, mais les salons multi-jeux et les conventions comme Japan Touch ou les grands salons du jeu attirent aussi des milliers de participants. Le format varie : tournois officiels organisés par les distributeurs, bourses d'échange indépendantes, conventions geek avec espace TCG. Cardagenda recense tous ces événements dans un agenda actualisé quotidiennement pour ne rien manquer près de chez vous.",
      faq: [
        {
          q: "Où trouver les prochaines bourses Pokémon en France ?",
          a: "Cardagenda liste tous les événements Pokémon TCG en France, des tournois officiels aux bourses d'échange locales. Filtrez par ville ou département pour trouver les salons les plus proches.",
        },
        {
          q: "Y a-t-il des salons Magic: The Gathering en France ?",
          a: "Oui, la France compte de nombreux événements Magic chaque mois : prétournois, drafts, conventions. Retrouvez le calendrier complet sur Cardagenda.",
        },
        {
          q: "Comment soumettre un événement TCG sur Cardagenda ?",
          a: "Vous organisez un salon ou une bourse ? Soumettez votre événement gratuitement via le formulaire de soumission. La fiche est en ligne en 24h.",
        },
      ],
    },
    en: {
      intro:
        "France is one of Europe's most active TCG markets. Every weekend, dozens of events bring together players and collectors in major cities: Paris, Lille, Lyon, Toulouse, Bordeaux, and Nice. Pokémon and Magic dominate the calendar, but multi-game card shows and conventions like Japan Touch attract thousands of attendees. Event formats range from official distributor tournaments to independent trade fairs and geek conventions with TCG floors. Cardagenda tracks all these events in a daily-updated calendar so you never miss a show near you.",
      faq: [
        {
          q: "Where can I find Pokémon TCG events in France?",
          a: "Cardagenda lists all Pokémon TCG events in France, from official tournaments to local trade fairs. Filter by city to find shows near you.",
        },
        {
          q: "Are there Magic: The Gathering events in France?",
          a: "Yes, France hosts many Magic events every month: prerelease weekends, drafts, and conventions. Find the full calendar on Cardagenda.",
        },
        {
          q: "How do I list a TCG event on Cardagenda?",
          a: "Organising a card show? Submit your event for free via the submission form. Your listing goes live within 24 hours.",
        },
      ],
    },
  },
  GB: {
    en: {
      intro:
        "The United Kingdom has one of the most vibrant card show scenes in Europe. From London's Olympia to Birmingham's NEC, the UK hosts world-class TCG events year-round. Regular card shows like the London Card Show, UK Card Shows, and Orbit Card Show attract collectors of Pokémon, sports cards, Magic, and One Piece from across the country. Scotland, Wales, and Northern Ireland each have their own growing scenes. Whether you're looking for a local trade fair, a national championship, or a multi-game convention, Cardagenda keeps an up-to-date calendar of every UK collectible card event.",
      faq: [
        {
          q: "Where can I find TCG events near me in the UK?",
          a: "Cardagenda lists collectible card events across England, Scotland, Wales, and Northern Ireland. Filter by city — London, Birmingham, Glasgow, Bristol, Brighton, and more.",
        },
        {
          q: "What are the biggest card shows in the UK?",
          a: "The UK's largest events include the London Card Show, Collector Showcase at Olympia London, Orbit Card Shows, and the Cardmania Events series. Cardagenda covers them all.",
        },
        {
          q: "Are there Pokémon card shows in the UK?",
          a: "Yes — Pokémon is one of the most popular TCGs at UK card shows. Most general card shows include a Pokémon section. Find them all on Cardagenda.",
        },
      ],
    },
    fr: {
      intro:
        "Le Royaume-Uni dispose de l'une des scènes de salons TCG les plus dynamiques d'Europe. De Londres à Birmingham, en passant par Glasgow et Bristol, les card shows britanniques attirent collectionneurs et joueurs de Pokémon, sports cards, Magic et One Piece. Cardagenda recense tous les événements de cartes à collectionner au Royaume-Uni dans un calendrier actualisé quotidiennement.",
      faq: [
        {
          q: "Où trouver des événements TCG au Royaume-Uni ?",
          a: "Cardagenda liste tous les salons et tournois TCG en Angleterre, Écosse, Pays de Galles et Irlande du Nord. Filtrez par ville : Londres, Birmingham, Glasgow, Bristol et plus encore.",
        },
        {
          q: "Quels sont les plus grands salons de cartes au Royaume-Uni ?",
          a: "Les événements majeurs incluent le London Card Show, Collector Showcase à l'Olympia London, les Orbit Card Shows et la série Cardmania Events. Cardagenda les couvre tous.",
        },
      ],
    },
  },
  BE: {
    fr: {
      intro:
        "La Belgique est un marché TCG très actif, notamment pour Pokémon, Magic et les sports cards. Bruxelles, Gand, Waregem, Bruges et Liège concentrent la plupart des événements : bourses d'échange, conventions multi-jeux et tournois officiels. Des salons comme le Brussels Card Show, le TCGeek Fest à Waregem, ou encore les événements GameLoods rassemblent chaque année des centaines de collectionneurs. La proximité avec la France, les Pays-Bas et l'Allemagne en fait un hub naturel pour les événements transfrontaliers.",
      faq: [
        {
          q: "Où trouver des événements TCG en Belgique ?",
          a: "Cardagenda liste tous les salons et tournois TCG en Belgique, de Bruxelles à Gand en passant par Liège et Waregem.",
        },
        {
          q: "Y a-t-il des bourses Pokémon en Belgique ?",
          a: "Oui, la Belgique accueille régulièrement des bourses et tournois Pokémon. Retrouvez le calendrier complet sur Cardagenda.",
        },
        {
          q: "Comment trouver un salon de cartes sportives en Belgique ?",
          a: "Les sports cards gagnent en popularité en Belgique. Cardagenda recense les événements dédiés aux cartes sportives (NBA, football, baseball) ainsi que les grands salons multi-jeux.",
        },
      ],
    },
    en: {
      intro:
        "Belgium punches above its weight in the European TCG scene. Brussels, Ghent, Waregem, Bruges, and Liège host regular card shows, multi-game conventions, and official tournaments for Pokémon, Magic, and sports cards. Events like Brussels Card Show, TCGeek Fest Waregem, and GameLoods gatherings draw hundreds of collectors every year. Belgium's central location makes it a natural crossroads for collectors from France, the Netherlands, and Germany.",
      faq: [
        {
          q: "Where can I find TCG events in Belgium?",
          a: "Cardagenda lists all card shows and tournaments in Belgium, from Brussels to Ghent, Liège, and Waregem.",
        },
        {
          q: "Are there Pokémon events in Belgium?",
          a: "Yes, Belgium hosts regular Pokémon trade fairs and tournaments. Find the full calendar on Cardagenda.",
        },
      ],
    },
  },
  DE: {
    de: {
      intro:
        "Deutschland gehört zu den größten TCG-Märkten Europas. Von München bis Hamburg, von Düsseldorf bis Berlin finden regelmäßig Kartenbörsen, Turniere und Conventions statt. Pokémon, Magic: The Gathering, Yu-Gi-Oh! und Sports Cards dominieren den Kalender. Große Events wie die TCG Germany, die X-Mas Card Expo in Düsseldorf oder Commandfest ziehen tausende Besucher an. Cardagenda listet alle Kartenevents in Deutschland in einem täglich aktualisierten Kalender.",
      faq: [
        {
          q: "Wo finde ich TCG-Events in Deutschland?",
          a: "Cardagenda listet alle Kartenbörsen, Turniere und Conventions in Deutschland. Filtere nach Stadt: München, Berlin, Frankfurt, Hamburg, Düsseldorf und mehr.",
        },
        {
          q: "Welche großen Kartenbörsen gibt es in Deutschland?",
          a: "Zu den größten Events zählen TCG Germany Munich, X-Mas Card Expo Düsseldorf, Commandfest und Cardvention Karlsruhe.",
        },
        {
          q: "Gibt es Pokémon-Turniere in Deutschland?",
          a: "Ja, Deutschland ist ein sehr aktiver Pokémon-Markt mit Prereleases, Regionals und Pokémon Championships.",
        },
      ],
    },
    en: {
      intro:
        "Germany is one of Europe's largest TCG markets. From Munich to Hamburg, Düsseldorf to Berlin, regular card shows, tournaments, and conventions are held throughout the year. Pokémon, Magic: The Gathering, Yu-Gi-Oh!, and sports cards dominate the calendar. Major events include TCG Germany, the X-Mas Card Expo in Düsseldorf, and Commandfest. Cardagenda lists all collectible card events in Germany in a daily-updated calendar.",
      faq: [
        {
          q: "Where can I find TCG events in Germany?",
          a: "Cardagenda lists all card shows, tournaments, and conventions in Germany. Filter by city: Munich, Berlin, Frankfurt, Hamburg, Düsseldorf, and more.",
        },
        {
          q: "What are the biggest card shows in Germany?",
          a: "The largest events include TCG Germany Munich, X-Mas Card Expo Düsseldorf, Commandfest, and Cardvention Karlsruhe.",
        },
      ],
    },
    fr: {
      intro:
        "L'Allemagne est l'un des plus grands marchés TCG d'Europe, avec des bourses et conventions régulières dans toutes les grandes villes. Cardagenda recense tous les événements de cartes à collectionner en Allemagne dans un calendrier actualisé quotidiennement.",
      faq: [
        {
          q: "Où trouver des événements TCG en Allemagne ?",
          a: "Cardagenda liste toutes les bourses, tournois et conventions en Allemagne : Munich, Berlin, Francfort, Hambourg, Düsseldorf et plus encore.",
        },
      ],
    },
  },
  NL: {
    en: {
      intro:
        "The Netherlands has a thriving collectible card scene centred around Amsterdam, Utrecht, and Rotterdam. Card shows, trade fairs, and TCG tournaments take place every month. CardCon in Utrecht is one of Europe's largest TCG events. Dutch collectors are particularly active in Pokémon, Magic, and sports cards. Cardagenda tracks all Netherlands card events so you never miss a show near Amsterdam, Utrecht, or Rotterdam.",
      faq: [
        {
          q: "Where can I find TCG events in the Netherlands?",
          a: "Cardagenda lists all card shows and tournaments in the Netherlands. Filter by city: Amsterdam, Utrecht, Rotterdam, and more.",
        },
        {
          q: "What is CardCon Utrecht?",
          a: "CardCon is one of Europe's largest TCG events, held in Utrecht, Netherlands. It covers Pokémon, Magic, sports cards, and more.",
        },
      ],
    },
    fr: {
      intro:
        "Les Pays-Bas ont une scène TCG très dynamique, avec des événements réguliers à Amsterdam, Utrecht et Rotterdam. CardCon à Utrecht est l'un des plus grands événements TCG d'Europe. Cardagenda recense tous les événements de cartes à collectionner aux Pays-Bas.",
      faq: [
        {
          q: "Où trouver des événements TCG aux Pays-Bas ?",
          a: "Cardagenda liste tous les salons et tournois aux Pays-Bas : Amsterdam, Utrecht, Rotterdam et plus encore.",
        },
      ],
    },
  },
};

/**
 * Returns editorial copy for a country + locale combo, or null if not available.
 * Falls back: exact locale → 'en' → null.
 */
export function getCountryEditorialCopy(
  countryCode: string,
  locale: string
): CountryEditorialCopy | null {
  const entry = GEO_EDITORIAL[countryCode];
  if (!entry) return null;
  // Try exact locale first (e.g. 'de' for Germany), then 'en', then 'fr'
  return (
    (entry as Record<string, CountryEditorialCopy>)[locale] ??
    entry.en ??
    entry.fr ??
    null
  );
}
