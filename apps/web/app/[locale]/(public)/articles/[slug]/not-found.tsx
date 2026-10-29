import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface Props {
  // Next.js App Router injects params into not-found only via layout context;
  // we can read the locale from the closest layout via next-intl.
}

// Shown when getArticleBySlug returns null for the requested locale — e.g. a
// FR-only article accessed at /en/articles/[slug]. The GROQ ARTICLE_LOCALE_FILTER
// returns null for that case and page.tsx calls notFound(), bubbling here.
export default async function ArticleNotFound(_props: Props) {
  // next-intl infers locale from the closest [locale] layout segment.
  let backLabel = "Back to articles";
  let heading = "Article not found";
  let body = "This article is not available in this language.";

  try {
    const t = await getTranslations("articleDetail");
    backLabel = t("backLink");
    heading = "404";
    body = t("notFound");
  } catch {
    // Fallback to English if translation context is unavailable.
  }

  return (
    <div className="container py-16 max-w-3xl">
      <div className="border-4 border-black shadow-brutal p-12 bg-white text-center">
        <div className="text-5xl mb-4">📄</div>
        <h1 className="font-display text-3xl font-black uppercase text-black mb-3">
          {heading}
        </h1>
        <p className="text-black/70 font-medium mb-8">{body}</p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 bg-black text-[#FFDE03] px-6 py-3 font-display font-black uppercase border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
