import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import { getArticles } from "@/lib/queries/articles";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cardagenda.com";
  const otherLocale = locale === "fr" ? "en" : "fr";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${appUrl}/${locale}/articles`,
      languages: {
        [locale]: `${appUrl}/${locale}/articles`,
        [otherLocale]: `${appUrl}/${otherLocale}/articles`,
        "x-default": `${appUrl}/fr/articles`,
      },
    },
  };
}

const PER_PAGE = 12;

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "articles" });

  const currentPage = Number(sp.page ?? 1);
  const { data: articles, total, totalPages } = await getArticles(currentPage, PER_PAGE);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 border-b-4 border-black pb-6">
        <h1 className="font-display text-4xl font-black uppercase text-black mb-2">
          {t("title")}
        </h1>
        <p className="text-black/60 font-medium">{t("subtitle")}</p>
        {total > 0 && (
          <p className="text-sm text-black/40 mt-1">
            {total} {total === 1 ? t("articleCountOne") : t("articleCountOther")}
          </p>
        )}
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/articles"
              searchParams={sp}
            />
          )}
        </>
      ) : (
        <div className="border-4 border-black border-dashed p-16 text-center">
          <p className="font-bold text-black/60 text-lg">{t("noArticles")}</p>
        </div>
      )}
    </div>
  );
}
