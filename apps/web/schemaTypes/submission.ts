import { defineField, defineType } from "sanity";

export const submissionSchema = defineType({
  name: "submission",
  title: "Soumission",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
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
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En attente", value: "en_attente" },
          { title: "Approuvé", value: "approuve" },
          { title: "Rejeté", value: "rejete" },
          { title: "Doublon", value: "doublon" },
        ],
      },
      initialValue: "en_attente",
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
    }),
    defineField({
      name: "country",
      title: "Pays",
      type: "string",
      options: {
        list: [
          { title: "🇫🇷 France", value: "FR" },
          { title: "🇧🇪 Belgique", value: "BE" },
          { title: "🇨🇭 Suisse", value: "CH" },
          { title: "🇱🇺 Luxembourg", value: "LU" },
          { title: "🇨🇦 Canada", value: "CA" },
        ],
      },
      initialValue: "FR",
    }),
    defineField({
      name: "departmentCode",
      title: "Département / Province",
      type: "string",
    }),
    defineField({
      name: "postalCode",
      title: "Code postal",
      type: "string",
    }),
    defineField({
      name: "startsAt",
      title: "Début",
      type: "datetime",
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
      name: "image",
      title: "Photo de l'événement",
      type: "image",
      options: { hotspot: true },
    }),
    // Metadata
    defineField({
      name: "honeypotField",
      title: "Honeypot (anti-spam)",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "submitterIp",
      title: "IP soumetteur",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "rejectionReason",
      title: "Raison du rejet",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "reviewedAt",
      title: "Date de modération",
      type: "datetime",
    }),
    defineField({
      name: "promotedToEventId",
      title: "ID de l'événement créé",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
      city: "city",
      status: "status",
    },
    prepare({ title, city, status }) {
      const statusEmoji =
        status === "en_attente"
          ? "⏳"
          : status === "approuve"
            ? "✅"
            : status === "rejete"
              ? "❌"
              : "🔄";
      return {
        title: title ?? "Sans titre",
        subtitle: `${statusEmoji} ${city ?? ""}`,
      };
    },
  },
});
