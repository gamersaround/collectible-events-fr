import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NoiseSVG } from "@/components/ui/NoiseSVG";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com"),
  title: {
    default: "CardAgenda — Agenda des événements cartes à collectionner",
    template: "%s | CardAgenda",
  },
  description:
    "Trouvez tous les événements cartes de collection en France et en Belgique : tournois Pokémon, Magic, Yu-Gi-Oh, One Piece, Lorcana, cartes NBA, foot et bien plus. Calendrier mis à jour en temps réel.",
  keywords: [
    "événement Pokémon France",
    "tournoi Magic the Gathering",
    "tournoi Yu-Gi-Oh",
    "agenda tournoi carte",
    "bourse carte à collectionner",
    "convention TCG",
    "événement carte NBA",
    "cartes foot",
    "tournoi One Piece carte",
    "calendrier événement TCG",
    "tournoi Lorcana",
    "Dragon Ball Super Card Game",
    "Flesh and Blood tournoi",
    "sports cards événement",
    "carte collection France",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com",
    siteName: "CardAgenda",
    images: [
      {
        url: "/logo.jpg",
        width: 500,
        height: 500,
        alt: "CardAgenda — Agenda des événements cartes à collectionner",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "CardAgenda — Agenda des événements cartes à collectionner",
    description:
      "Tous les tournois, bourses et conventions de cartes à collectionner en France. Pokémon, Magic, NBA, Foot et plus.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${archivoBlack.variable} ${spaceGrotesk.variable} font-body`}>
        <NoiseSVG />
        {children}
      </body>
    </html>
  );
}
