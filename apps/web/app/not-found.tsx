import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/event-series";

export const metadata: Metadata = {
  title: "404",
  robots: NOINDEX_ROBOTS,
};

export default function RootNotFound() {
  return (
    <html lang="fr">
      <body>
        <h1>404</h1>
      </body>
    </html>
  );
}
