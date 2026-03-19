export default function CategoryLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-gfm-dark py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-12 w-80 rounded-lg bg-white/10" />
          <div className="mt-4 h-6 w-96 max-w-full rounded-lg bg-white/5" />
          <div className="mt-8 h-12 w-44 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 h-8 w-64 rounded-lg bg-gray-100" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
