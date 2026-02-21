import { defineField, defineType } from "sanity";

export const eventSchema = defineType({
  name: "event",
  title: "Événement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(300),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
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
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "Tournoi", value: "tournoi" },
          { title: "Bourse / Vide-greniers", value: "bourse" },
          { title: "Convention", value: "convention" },
          { title: "Draft", value: "draft" },
          { title: "Prélancement", value: "prereleases" },
          { title: "Ligue", value: "league" },
          { title: "Casual / Soirée", value: "casual" },
          { title: "Championnat", value: "championship" },
        ],
      },
      initialValue: "tournoi",
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "À venir", value: "a_venir" },
          { title: "En cours", value: "en_cours" },
          { title: "Terminé", value: "termine" },
          { title: "Annulé", value: "annule" },
        ],
      },
      initialValue: "a_venir",
    }),
    defineField({
      name: "venueName",
      title: "Nom du lieu",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "Ville",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "departmentCode",
      title: "Code département",
      type: "string",
    }),
    defineField({
      name: "postalCode",
      title: "Code postal",
      type: "string",
    }),
    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
    }),
    defineField({
      name: "startsAt",
      title: "Début",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Fin",
      type: "datetime",
    }),
    defineField({
      name: "entryFee",
      title: "Frais d'inscription (€)",
      type: "number",
    }),
    defineField({
      name: "maxParticipants",
      title: "Nombre de places maximum",
      type: "number",
    }),
    defineField({
      name: "registrationUrl",
      title: "URL d'inscription",
      type: "url",
    }),
    defineField({
      name: "organizerName",
      title: "Nom de l'organisateur",
      type: "string",
    }),
    defineField({
      name: "organizerContact",
      title: "Contact organisateur",
      type: "string",
    }),
    defineField({
      name: "websiteUrl",
      title: "Site web",
      type: "url",
    }),
    defineField({
      name: "sourceId",
      title: "Source ID",
      type: "string",
    }),
    defineField({
      name: "externalId",
      title: "ID externe",
      type: "string",
    }),
    defineField({
      name: "sourceUrl",
      title: "URL source",
      type: "url",
    }),
    defineField({
      name: "fingerprint",
      title: "Empreinte (déduplication)",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
      city: "city",
      startsAt: "startsAt",
      status: "status",
    },
    prepare({ title, city, startsAt, status }) {
      const date = startsAt
        ? new Date(startsAt).toLocaleDateString("fr-FR")
        : "—";
      return {
        title: title ?? "Sans titre",
        subtitle: `${city ?? ""} — ${date} [${status ?? ""}]`,
      };
    },
  },
});
