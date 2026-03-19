export default function DocsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse">
      <div className="mx-auto mb-4 h-10 w-72 rounded-lg bg-gray-100" />
      <div className="mx-auto mb-12 h-6 w-96 max-w-full rounded-lg bg-gray-100" />
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
