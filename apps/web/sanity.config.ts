import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { PromoteToEventAction } from "./actions/promoteToEvent";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "agenda-cartes-fr",
  title: "Agenda Cartes FR",

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, { schemaType }) => {
      if (schemaType === "submission") {
        return [PromoteToEventAction, ...prev];
      }
      return prev;
    },
  },
});
