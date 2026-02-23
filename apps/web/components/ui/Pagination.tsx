import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}

function buildUrl(
  page: number,
  basePath: string,
  searchParams: Record<string, string | string[] | undefined>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    }
  }

  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export async function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const t = await getTranslations("pagination");

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1, basePath, searchParams)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label={t("previousPage")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="p-2 text-gray-300" aria-disabled>
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page, basePath, searchParams)}
            className={cn(
              "min-w-[2.25rem] h-9 flex items-center justify-center rounded-lg text-sm font-medium",
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1, basePath, searchParams)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label={t("nextPage")}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="p-2 text-gray-300" aria-disabled>
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </nav>
  );
}
