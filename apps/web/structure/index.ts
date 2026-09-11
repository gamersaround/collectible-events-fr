import type { StructureBuilder } from "sanity/structure";

type Order = { field: string; direction: "asc" | "desc" };

function eventList(
  S: StructureBuilder,
  title: string,
  ordering: Order[],
  filter = '_type == "event"'
) {
  return S.documentList()
    .title(title)
    .schemaType("event")
    .filter(filter)
    .defaultOrdering(ordering);
}

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

      // Articles
      S.listItem()
        .title("✍️ Articles")
        .schemaType("article")
        .child(
          S.documentList()
            .title("Articles")
            .filter('_type == "article"')
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),

      S.divider(),

      // Events — nested views so latest imports are one click, not buried by startsAt
      S.listItem()
        .title("📅 Événements")
        .id("evenements")
        .schemaType("event")
        .child(
          S.list()
            .title("Événements")
            .items([
              S.listItem()
                .title("🆕 Derniers ajouts")
                .id("evenements-ajouts")
                .schemaType("event")
                .child(
                  eventList(S, "Derniers ajouts", [
                    { field: "_createdAt", direction: "desc" },
                  ])
                ),
              S.listItem()
                .title("✏️ Dernières modifications")
                .id("evenements-modifs")
                .schemaType("event")
                .child(
                  eventList(S, "Dernières modifications", [
                    { field: "_updatedAt", direction: "desc" },
                  ])
                ),
              S.listItem()
                .title("📅 Par date d'événement")
                .id("evenements-par-date")
                .schemaType("event")
                .child(
                  eventList(S, "Par date d'événement", [
                    { field: "startsAt", direction: "asc" },
                  ])
                ),
              S.divider(),
              S.listItem()
                .title("Notre sélection")
                .id("evenements-selection")
                .schemaType("event")
                .child(
                  eventList(
                    S,
                    "Notre sélection",
                    [{ field: "featuredFrom", direction: "desc" }],
                    '_type == "event" && featured == true'
                  )
                ),
              S.divider(),
              S.listItem()
                .title("Tous les événements")
                .id("evenements-tous")
                .schemaType("event")
                .child(
                  S.documentTypeList("event")
                    .title("Tous les événements")
                    .defaultOrdering([
                      { field: "_createdAt", direction: "desc" },
                    ])
                ),
              S.divider(),
              S.listItem()
                .title("À venir")
                .id("evenements-a-venir")
                .schemaType("event")
                .child(
                  eventList(
                    S,
                    "À venir",
                    [{ field: "startsAt", direction: "asc" }],
                    '_type == "event" && status == "a_venir"'
                  )
                ),
              S.listItem()
                .title("En cours")
                .id("evenements-en-cours")
                .schemaType("event")
                .child(
                  eventList(
                    S,
                    "En cours",
                    [{ field: "startsAt", direction: "asc" }],
                    '_type == "event" && status == "en_cours"'
                  )
                ),
              S.listItem()
                .title("Terminés")
                .id("evenements-termines")
                .schemaType("event")
                .child(
                  eventList(
                    S,
                    "Terminés",
                    [{ field: "startsAt", direction: "desc" }],
                    '_type == "event" && status == "termine"'
                  )
                ),
              S.listItem()
                .title("Annulés")
                .id("evenements-annules")
                .schemaType("event")
                .child(
                  eventList(
                    S,
                    "Annulés",
                    [{ field: "_updatedAt", direction: "desc" }],
                    '_type == "event" && status == "annule"'
                  )
                ),
            ])
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
