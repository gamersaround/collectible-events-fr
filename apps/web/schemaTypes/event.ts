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
      name: "image",
      title: "Photo de l'événement",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif (accessibilité)",
          type: "string",
        }),
      ],
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
      name: "tcgSportsRatio",
      title: "Ratio TCG / Cartes sportives",
      type: "number",
      description:
        "Salons mixtes uniquement. Indiquez le % TCG : 0 = 100 % sport, 50 = moitié-moitié, 100 = 100 % TCG. Laisser vide si événement pur.",
      validation: (Rule) => Rule.min(0).max(100).integer(),
    }),
    defineField({
      name: "primaryTcgType",
      title: "Icône principale (badge)",
      type: "string",
      description:
        "Icône affichée en haut à droite de la carte. Par défaut : premier jeu de la liste ci-dessus. Choisir ici pour mettre en avant un jeu en particulier (ex. un salon mixte où les sports cards dominent).",
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
      name: "country",
      title: "Pays",
      type: "string",
      options: {
        list: [
          // Europe de l'Ouest
          { title: "🇫🇷 France", value: "FR" },
          { title: "🇧🇪 Belgique", value: "BE" },
          { title: "🇨🇭 Suisse", value: "CH" },
          { title: "🇱🇺 Luxembourg", value: "LU" },
          { title: "🇩🇪 Allemagne", value: "DE" },
          { title: "🇬🇧 Royaume-Uni", value: "GB" },
          { title: "🇮🇪 Irlande", value: "IE" },
          { title: "🇳🇱 Pays-Bas", value: "NL" },
          { title: "🇪🇸 Espagne", value: "ES" },
          { title: "🇵🇹 Portugal", value: "PT" },
          { title: "🇮🇹 Italie", value: "IT" },
          { title: "🇦🇹 Autriche", value: "AT" },
          // Europe du Nord
          { title: "🇸🇪 Suède", value: "SE" },
          { title: "🇳🇴 Norvège", value: "NO" },
          { title: "🇩🇰 Danemark", value: "DK" },
          { title: "🇫🇮 Finlande", value: "FI" },
          { title: "🇮🇸 Islande", value: "IS" },
          // Europe centrale & de l'Est
          { title: "🇵🇱 Pologne", value: "PL" },
          { title: "🇨🇿 République tchèque", value: "CZ" },
          { title: "🇸🇰 Slovaquie", value: "SK" },
          { title: "🇭🇺 Hongrie", value: "HU" },
          { title: "🇷🇴 Roumanie", value: "RO" },
          { title: "🇧🇬 Bulgarie", value: "BG" },
          { title: "🇬🇷 Grèce", value: "GR" },
          { title: "🇸🇮 Slovénie", value: "SI" },
          { title: "🇭🇷 Croatie", value: "HR" },
          { title: "🇷🇸 Serbie", value: "RS" },
          { title: "🇱🇹 Lituanie", value: "LT" },
          { title: "🇱🇻 Lettonie", value: "LV" },
          { title: "🇪🇪 Estonie", value: "EE" },
          { title: "🇲🇹 Malte", value: "MT" },
          { title: "🇨🇾 Chypre", value: "CY" },
          // Amérique du Nord
          { title: "🇺🇸 États-Unis", value: "US" },
          { title: "🇨🇦 Canada", value: "CA" },
          { title: "🇲🇽 Mexique", value: "MX" },
          // Amérique du Sud
          { title: "🇧🇷 Brésil", value: "BR" },
          { title: "🇦🇷 Argentine", value: "AR" },
          // Asie-Pacifique
          { title: "🇯🇵 Japon", value: "JP" },
          { title: "🇰🇷 Corée du Sud", value: "KR" },
          { title: "🇦🇺 Australie", value: "AU" },
          { title: "🇳🇿 Nouvelle-Zélande", value: "NZ" },
          // Autre
          { title: "🌍 Autre", value: "OTHER" },
        ],
      },
      initialValue: "FR",
      validation: (Rule) => Rule.required(),
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
