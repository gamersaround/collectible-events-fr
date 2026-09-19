import { sanityServerClient } from "@/lib/sanity/client";
import type { SanityImage } from "@/lib/queries/events";
import {
  ARTICLES_PAGINATED_QUERY,
  ARTICLES_COUNT_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  ALL_ARTICLE_SLUGS_QUERY,
  RECENT_ARTICLES_QUERY,
} from "@/lib/sanity/queries";
import type { PaginatedResult } from "@/types/events";

export interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  meta_description: string | null;
  published_at: string;
  author: string | null;
  category: string | null;
  tcg_types: string[];
  cover_image: SanityImage | null;
  has_en: boolean;
}

export interface ArticleDetailRow extends ArticleRow {
  body: Array<{ _type: string; [key: string]: unknown }>;
}

export interface ArticleSlugRow {
  slug: string;
  hasEn: boolean;
}

const DEFAULT_PER_PAGE = 12;

export async function getArticles(
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  locale = "fr"
): Promise<PaginatedResult<ArticleRow>> {
  const from = (page - 1) * perPage;
  // GROQ `...` is exclusive of the end index (same as Array.slice).
  const to = from + perPage;

  const [data, total] = await Promise.all([
    sanityServerClient.fetch<ArticleRow[]>(ARTICLES_PAGINATED_QUERY, { from, to, locale }),
    sanityServerClient.fetch<number>(ARTICLES_COUNT_QUERY, { locale }),
  ]);

  return {
    data: data ?? [],
    total: total ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((total ?? 0) / perPage),
  };
}

export async function getArticleBySlug(
  slug: string,
  locale = "fr"
): Promise<ArticleDetailRow | null> {
  return sanityServerClient.fetch<ArticleDetailRow | null>(ARTICLE_BY_SLUG_QUERY, {
    slug,
    locale,
  });
}

export async function getAllArticleSlugs(): Promise<ArticleSlugRow[]> {
  const slugs = await sanityServerClient.fetch<ArticleSlugRow[]>(ALL_ARTICLE_SLUGS_QUERY);
  return (slugs ?? []).filter((row) => Boolean(row?.slug));
}

export async function getRecentArticles(locale = "fr"): Promise<ArticleRow[]> {
  const articles = await sanityServerClient.fetch<ArticleRow[]>(RECENT_ARTICLES_QUERY, {
    locale,
  });
  return articles ?? [];
}
