export default function Loading() {
  return (
    <div className="container py-8 max-w-3xl animate-pulse">
      <div className="h-4 bg-gray-200 w-32 mb-6" />
      <div className="h-56 bg-gray-200 border-2 border-black mb-8" />
      <div className="h-5 bg-gray-200 w-24 mb-4" />
      <div className="h-10 bg-gray-200 w-full mb-2" />
      <div className="h-10 bg-gray-200 w-3/4 mb-6" />
      <div className="h-5 bg-gray-100 w-full mb-2" />
      <div className="h-5 bg-gray-100 w-full mb-2" />
      <div className="h-5 bg-gray-100 w-4/5 mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-100" style={{ width: `${85 + (i % 3) * 5}%` }} />
        ))}
      </div>
    </div>
  );
}
