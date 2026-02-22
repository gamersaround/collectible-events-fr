import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CardAgenda",
    short_name: "CardAgenda",
    description: "Agenda des événements cartes à collectionner",
    start_url: "/",
    display: "standalone",
    background_color: "#FFDE03",
    theme_color: "#FFDE03",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  };
}
