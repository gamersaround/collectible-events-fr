import { defineField, defineType } from "sanity";

export const crawlRunSchema = defineType({
  name: "crawlRun",
  title: "Historique crawl",
  type: "document",
  fields: [
    defineField({
      name: "sourceId",
      title: "Source ID",
      type: "string",
    }),
    defineField({
      name: "sourceName",
      title: "Nom de la source",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En cours", value: "running" },
          { title: "Succès", value: "success" },
          { title: "Erreur", value: "error" },
          { title: "Partiel", value: "partial" },
        ],
      },
    }),
    defineField({
      name: "startedAt",
      title: "Démarré à",
      type: "datetime",
    }),
    defineField({
      name: "finishedAt",
      title: "Terminé à",
      type: "datetime",
    }),
    defineField({
      name: "eventsFound",
      title: "Événements trouvés",
      type: "number",
    }),
    defineField({
      name: "eventsCreated",
      title: "Événements créés",
      type: "number",
    }),
    defineField({
      name: "eventsUpdated",
      title: "Événements mis à jour",
      type: "number",
    }),
    defineField({
      name: "eventsSkipped",
      title: "Événements ignorés",
      type: "number",
    }),
    defineField({
      name: "errorMessage",
      title: "Message d'erreur",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      sourceName: "sourceName",
      status: "status",
      startedAt: "startedAt",
      eventsCreated: "eventsCreated",
    },
    prepare({ sourceName, status, startedAt, eventsCreated }) {
      const statusEmoji =
        status === "success"
          ? "✅"
          : status === "error"
            ? "❌"
            : status === "running"
              ? "🔄"
              : "⚠️";
      const date = startedAt
        ? new Date(startedAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—";
      return {
        title: `${statusEmoji} ${sourceName ?? "Source inconnue"}`,
        subtitle: `${date} — +${eventsCreated ?? 0} événements`,
      };
    },
  },
});
