export default function ImpactFeedLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-gfm-dark py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-10 w-80 rounded-lg bg-white/10" />
          <div className="mt-4 h-6 w-96 max-w-full rounded-lg bg-white/5" />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
