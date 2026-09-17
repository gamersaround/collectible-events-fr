import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NoiseSVG } from "@/components/ui/NoiseSVG";
import { SiteSchemas } from "@/components/seo/SiteSchemas";
import "../globals.css";

const ADSENSE_CLIENT = "ca-pub-8480412242622897";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com"),
    title: {
      default: t("defaultTitle"),
      template: t("titleTemplate"),
    },
    description: t("defaultDescription"),
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com",
      siteName: "CardAgenda",
      images: [
        {
          url: "/logo.jpg",
          width: 500,
          height: 500,
          alt: "CardAgenda",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
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
    alternates: {
      languages: {
        fr: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com"}/fr`,
        en: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com"}/en`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Native <script> in <head> so Google sees adsbygoogle.js on every public page.
            next/script afterInteractive injects outside <head>; beforeInteractive is root-layout only. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${archivoBlack.variable} ${spaceGrotesk.variable} font-body`}>
        <SiteSchemas locale={locale} />
        <NoiseSVG />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
