import { ArticleCardSkeleton } from "@/components/articles/ArticleCard";

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-8 border-b-4 border-black pb-6">
        <div className="h-10 bg-gray-200 w-48 animate-pulse mb-2" />
        <div className="h-5 bg-gray-100 w-64 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
