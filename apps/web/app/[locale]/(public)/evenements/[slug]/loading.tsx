export default function Loading() {
  return (
    <div className="container py-8 max-w-4xl animate-pulse">
      <div className="h-56 bg-gray-200 border-2 border-black mb-8" />
      <div className="h-8 bg-gray-200 w-2/3 mb-4" />
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 border border-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
