import { urlFor } from "@/lib/sanity/image";
import type { ArticleDetailRow } from "@/lib/queries/articles";

interface ArticleSchemaProps {
  article: ArticleDetailRow;
  locale: string;
}

export function ArticleSchema({ article, locale }: ArticleSchemaProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const articleUrl = `${appUrl}/${locale}/articles/${article.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.published_at,
    author: {
      "@type": "Person",
      name: article.author ?? "CardAgenda",
    },
    publisher: {
      "@type": "Organization",
      name: "CardAgenda",
      url: appUrl,
      logo: {
        "@type": "ImageObject",
        url: `${appUrl}/logo.jpg`,
      },
    },
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(article.cover_image
      ? {
          image: urlFor(article.cover_image).width(1200).height(630).auto("format").url(),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
