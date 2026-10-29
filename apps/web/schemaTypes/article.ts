import { defineField, defineType } from "sanity";

export const articleSchema = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(200),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 200 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Guide", value: "guide" },
          { title: "Actualité", value: "news" },
          { title: "Compte rendu de tournoi", value: "tournament_report" },
        ],
      },
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
          { title: "One Piece", value: "one_piece" },
          { title: "Dragon Ball Super", value: "dragon_ball" },
          { title: "Lorcana", value: "lorcana" },
          { title: "Flesh and Blood", value: "flesh_blood" },
          { title: "Cartes sportives (NBA, foot…)", value: "sports_cards" },
          { title: "Autres", value: "autres" },
        ],
      },
    }),
    defineField({
      name: "excerpt",
      title: "Résumé",
      type: "text",
      rows: 3,
      description: "Court résumé affiché dans les listes et les meta descriptions.",
    }),
    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Contenu (legacy — remplacé par bodyFr)",
      type: "array",
      description: "Champ hérité. Utilisez bodyFr pour le contenu français.",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
            defineField({ name: "caption", title: "Légende", type: "string" }),
          ],
        },
      ],
    }),
    // ─── Bilingual fields ────────────────────────────────────────────────────
    defineField({
      name: "titleFr",
      title: "Titre FR",
      type: "string",
      description: "Titre pour la version française (/fr). Laissez vide pour utiliser « Titre » ci-dessus.",
    }),
    defineField({
      name: "titleEn",
      title: "Titre EN",
      type: "string",
      description: "Titre pour la version anglaise (/en). Si absent, la page /en renvoie une 404.",
    }),
    defineField({
      name: "metaDescriptionFr",
      title: "Meta description FR",
      type: "text",
      rows: 2,
      description: "140–155 caractères. Meta description pour /fr.",
    }),
    defineField({
      name: "metaDescriptionEn",
      title: "Meta description EN",
      type: "text",
      rows: 2,
      description: "140–155 characters. Meta description for /en.",
    }),
    defineField({
      name: "bodyFr",
      title: "Contenu FR",
      type: "array",
      description: "Corps de l'article pour /fr. Prioritaire sur le champ legacy « Contenu ».",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
            defineField({ name: "caption", title: "Légende", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "bodyEn",
      title: "Contenu EN",
      type: "array",
      description: "Article body for /en. Required if titleEn is set.",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Date de publication (récent d'abord)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "coverImage",
      publishedAt: "publishedAt",
    },
    prepare({ title, author, media, publishedAt }) {
      return {
        title,
        subtitle: `${author ?? "CardAgenda"} — ${publishedAt ? new Date(publishedAt).toLocaleDateString("fr") : "Non publié"}`,
        media,
      };
    },
  },
});
