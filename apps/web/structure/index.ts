import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Agenda Cartes FR")
    .items([
      // Moderation queue
      S.listItem()
        .title("📋 File de modération")
        .child(
          S.documentList()
            .title("Soumissions en attente")
            .filter('_type == "submission" && status == "en_attente"')
            .defaultOrdering([{ field: "_createdAt", direction: "asc" }])
        ),

      S.divider(),

      // Events
      S.listItem()
        .title("📅 Événements")
        .schemaType("event")
        .child(
          S.documentList()
            .title("Tous les événements")
            .filter('_type == "event"')
            .defaultOrdering([{ field: "startsAt", direction: "asc" }])
        ),

      // All submissions (including reviewed)
      S.listItem()
        .title("📝 Toutes les soumissions")
        .schemaType("submission")
        .child(
          S.documentList()
            .title("Soumissions")
            .filter('_type == "submission"')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
        ),

      S.divider(),

      // Crawler sources
      S.listItem()
        .title("🕷️ Sources crawler")
        .schemaType("source")
        .child(
          S.documentList()
            .title("Sources")
            .filter('_type == "source"')
            .defaultOrdering([{ field: "name", direction: "asc" }])
        ),

      // Crawl history (read-only)
      S.listItem()
        .title("📊 Historique crawls")
        .child(
          S.documentList()
            .title("Historique des crawls")
            .filter('_type == "crawlRun"')
            .defaultOrdering([{ field: "startedAt", direction: "desc" }])
        ),

      S.divider(),

      // Departments reference
      S.listItem()
        .title("🗺️ Départements")
        .schemaType("department")
        .child(
          S.documentList()
            .title("Départements français")
            .filter('_type == "department"')
            .defaultOrdering([{ field: "code", direction: "asc" }])
        ),
    ]);
