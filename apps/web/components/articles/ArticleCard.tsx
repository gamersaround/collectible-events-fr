import Image from "next/image";
import { BookOpen, Newspaper, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/lib/sanity/image";
import { formatDateFr } from "@/lib/utils/dates";
import type { ArticleRow } from "@/lib/queries/articles";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; labelEn: string; icon: React.ReactNode; bg: string; color: string }
> = {
  guide: {
    label: "Guide",
    labelEn: "Guide",
    icon: <BookOpen className="h-3 w-3" />,
    bg: "bg-blue-100",
    color: "text-blue-800",
  },
  news: {
    label: "Actualité",
    labelEn: "News",
    icon: <Newspaper className="h-3 w-3" />,
    bg: "bg-[#FFDE03]",
    color: "text-black",
  },
  tournament_report: {
    label: "Compte rendu",
    labelEn: "Report",
    icon: <Trophy className="h-3 w-3" />,
    bg: "bg-red-100",
    color: "text-red-800",
  },
};

interface ArticleCardProps {
  article: ArticleRow;
  locale: string;
}

export function ArticleCard({ article, locale }: ArticleCardProps) {
  const dateLocale = locale as "fr" | "en";
  const category = article.category ? CATEGORY_CONFIG[article.category] : null;
  const formattedDate = formatDateFr(article.published_at, "d MMM yyyy", dateLocale);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col bg-white border-2 border-black shadow-brutal hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden border-b-2 border-black bg-gray-100">
        {article.cover_image ? (
          <Image
            src={urlFor(article.cover_image).width(600).height(400).auto("format").url()}
            alt={article.cover_image.alt ?? article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <BookOpen className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category badge */}
        {category && (
          <span
            className={`inline-flex items-center gap-1 self-start px-2 py-0.5 text-xs font-bold border border-black mb-3 ${category.bg} ${category.color}`}
          >
            {category.icon}
            {locale === "fr" ? category.label : category.labelEn}
          </span>
        )}

        {/* Title */}
        <h3 className="font-display text-lg font-black uppercase leading-tight mb-2 text-black group-hover:underline line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
          <span>{article.author ?? "CardAgenda"}</span>
          <time dateTime={article.published_at}>{formattedDate}</time>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border-2 border-black animate-pulse">
      <div className="h-48 bg-gray-200 border-b-2 border-black" />
      <div className="p-5">
        <div className="h-5 bg-gray-200 w-20 mb-3" />
        <div className="h-6 bg-gray-200 w-full mb-2" />
        <div className="h-6 bg-gray-200 w-3/4 mb-4" />
        <div className="h-4 bg-gray-100 w-full mb-2" />
        <div className="h-4 bg-gray-100 w-5/6" />
      </div>
    </div>
  );
}
