import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Agenda Cartes FR — Événements TCG en France",
    template: "%s | Agenda Cartes FR",
  },
  description:
    "Le répertoire des événements de cartes à collectionner en France : Pokémon TCG, Magic, Yu-Gi-Oh, One Piece, Lorcana et plus. Tournois, bourses, conventions.",
  keywords: [
    "TCG France",
    "événements Pokémon",
    "tournois Magic",
    "cartes à collectionner",
    "tournois Yu-Gi-Oh",
    "One Piece TCG France",
    "Lorcana France",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Agenda Cartes FR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
