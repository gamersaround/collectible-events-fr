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
  title: {
    default: "CardAgenda — TCG Events Near You",
    template: "%s | CardAgenda",
  },
  description:
    "Find TCG events near you: Pokémon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, Lorcana and more. Tournaments, conventions, drafts.",
  keywords: [
    "TCG events",
    "Pokémon tournament",
    "Magic the Gathering events",
    "collectible card game",
    "Yu-Gi-Oh tournament",
    "One Piece TCG",
    "Lorcana events",
    "card game agenda",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "CardAgenda",
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
      <body className={`${archivoBlack.variable} ${spaceGrotesk.variable} font-body`}>
        <NoiseSVG />
        {children}
      </body>
    </html>
  );
}
