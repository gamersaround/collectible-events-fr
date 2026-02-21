import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "agenda-cartes-fr",
  title: "Agenda Cartes FR",

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool(), // GROQ query explorer (dev helper)
  ],

  schema: {
    types: schemaTypes,
  },
});
