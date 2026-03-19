export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-[var(--gfm-light-green)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto h-12 w-96 max-w-full rounded-lg bg-white/50" />
          <div className="mx-auto mt-4 h-6 w-80 max-w-full rounded-lg bg-white/30" />
          <div className="mt-8 flex justify-center gap-4">
            <div className="h-12 w-44 rounded-full bg-white/40" />
            <div className="h-12 w-44 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
      {/* Categories skeleton */}
      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-8 h-8 w-48 rounded-lg bg-gray-100" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
      {/* Fundraisers skeleton */}
      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 h-8 w-56 rounded-lg bg-gray-100" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
