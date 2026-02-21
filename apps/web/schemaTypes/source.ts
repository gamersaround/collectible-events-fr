import { defineField, defineType } from "sanity";

export const sourceSchema = defineType({
  name: "source",
  title: "Source crawler",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type de source",
      type: "string",
      options: {
        list: [
          { title: "API officielle", value: "official_api" },
          { title: "HTML générique", value: "generic_html" },
          { title: "iCal", value: "ical" },
          { title: "RSS", value: "rss" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tcgTypes",
      title: "Types de jeu",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Pokémon TCG", value: "pokemon" },
          { title: "Magic: The Gathering", value: "magic" },
          { title: "Yu-Gi-Oh!", value: "yugioh" },
          { title: "Cartes sportives", value: "sports_cards" },
          { title: "One Piece Card Game", value: "one_piece" },
          { title: "Dragon Ball Super CG", value: "dragon_ball" },
          { title: "Disney Lorcana", value: "lorcana" },
          { title: "Flesh and Blood", value: "flesh_blood" },
          { title: "Autres TCG", value: "autres" },
        ],
      },
    }),
    defineField({
      name: "adapterConfig",
      title: "Configuration de l'adaptateur",
      type: "object",
      fields: [
        defineField({ name: "selector", title: "Sélecteur CSS", type: "string" }),
        defineField({ name: "dateFormat", title: "Format de date", type: "string" }),
        defineField({ name: "apiKey", title: "Clé API", type: "string" }),
        defineField({ name: "extra", title: "Extra (JSON)", type: "text" }),
      ],
    }),
    defineField({
      name: "crawlFrequencyHours",
      title: "Fréquence de crawl (heures)",
      type: "number",
      initialValue: 24,
    }),
    defineField({
      name: "lastCrawledAt",
      title: "Dernier crawl",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      url: "url",
      isActive: "isActive",
    },
    prepare({ title, url, isActive }) {
      return {
        title: `${isActive ? "✅" : "⏸️"} ${title}`,
        subtitle: url,
      };
    },
  },
});
