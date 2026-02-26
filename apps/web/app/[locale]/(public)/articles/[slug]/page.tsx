import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/queries/articles";
import { urlFor } from "@/lib/sanity/image";
import { formatDateFr } from "@/lib/utils/dates";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "articleDetail" });
  const article = await getArticleBySlug(slug);

  if (!article) return { title: t("notFound") };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const otherLocale = locale === "fr" ? "en" : "fr";

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: {
      canonical: `${appUrl}/${locale}/articles/${slug}`,
      languages: {
        [locale]: `${appUrl}/${locale}/articles/${slug}`,
        [otherLocale]: `${appUrl}/${otherLocale}/articles/${slug}`,
        "x-default": `${appUrl}/fr/articles/${slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author ?? "CardAgenda"],
      images: article.cover_image
        ? [{ url: urlFor(article.cover_image).width(1200).height(630).auto("format").url() }]
        : [],
    },
  };
}

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-2xl font-black uppercase mt-10 mb-4 border-b-2 border-black pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-display text-xl font-black mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="font-bold text-lg mt-6 mb-2">{children}</h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 leading-relaxed text-gray-800">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-black pl-5 italic my-6 text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-outside ml-5 mb-5 space-y-1.5 text-gray-800">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-outside ml-5 mb-5 space-y-1.5 text-gray-800">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-black">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold hover:text-blue-600 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({
      value,
    }: {
      value: { asset: unknown; alt?: string; caption?: string };
    }) => (
      <figure className="my-8 border-2 border-black overflow-hidden shadow-brutal">
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <Image
            src={urlFor(value as Parameters<typeof urlFor>[0])
              .width(800)
              .auto("format")
              .url()}
            alt={value.alt ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
        {value.caption && (
          <figcaption className="text-sm text-gray-500 text-center p-3 border-t border-gray-200 bg-gray-50">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "articleDetail" });
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const dateLocale = locale as "fr" | "en";

  return (
    <>
      <ArticleSchema article={article} locale={locale} />
      <BreadcrumbSchema
        locale={locale}
        eventTitle={article.title}
        slug={slug}
        sectionName="Articles"
        sectionPath="/articles"
      />

      <div className="container py-8 max-w-3xl">
        {/* Back link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backLink")}
        </Link>

        {/* Cover image */}
        {article.cover_image && (
          <div className="relative h-56 md:h-80 w-full overflow-hidden border-2 border-black mb-8 shadow-brutal">
            <Image
              src={urlFor(article.cover_image).width(896).height(400).auto("format").url()}
              alt={article.cover_image.alt ?? article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <article>
          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.category && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-bold border-2 border-black bg-[#FFDE03] text-black uppercase tracking-wider">
                {article.category === "guide"
                  ? locale === "fr" ? "Guide" : "Guide"
                  : article.category === "news"
                  ? locale === "fr" ? "Actualité" : "News"
                  : locale === "fr" ? "Compte rendu" : "Report"}
              </span>
            )}
            <time
              dateTime={article.published_at}
              className="text-sm text-gray-500 font-medium"
            >
              {t("publishedAt")}{" "}
              {formatDateFr(article.published_at, "d MMMM yyyy", dateLocale)}
            </time>
            {article.author && (
              <span className="text-sm text-gray-500">— {article.author}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-black uppercase leading-tight mb-6 text-black">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 pb-8 border-b-2 border-black">
              {article.excerpt}
            </p>
          )}

          {/* Body */}
          {article.body && article.body.length > 0 && (
            <div className="prose-article">
              <PortableText
                value={article.body as unknown as Parameters<typeof PortableText>[0]["value"]}
                components={portableTextComponents}
              />
            </div>
          )}
        </article>
      </div>
    </>
  );
}
