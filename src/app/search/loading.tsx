export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-12 w-full rounded-full bg-[var(--gfm-bg)]" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-20 shrink-0 rounded-full bg-[var(--gfm-bg)]" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-[var(--gfm-bg)]" />
        ))}
      </div>
    </div>
  );
}
