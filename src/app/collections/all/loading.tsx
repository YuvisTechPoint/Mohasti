export default function CollectionsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 md:px-6 md:py-16">
      <div className="mb-6 h-4 w-32 rounded bg-gray-200" />
      <div className="mb-3 h-10 w-64 max-w-full rounded bg-gray-200" />
      <div className="mb-8 h-5 w-96 max-w-full rounded bg-gray-100" />
      <div className="mb-10 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 shrink-0 rounded-full bg-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="aspect-square bg-gray-100" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-4 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
