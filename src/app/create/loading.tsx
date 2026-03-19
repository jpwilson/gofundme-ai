export default function CreateLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 animate-pulse">
      <div className="mx-auto mb-8 h-8 w-64 rounded-lg bg-gray-100" />
      <div className="flex justify-center gap-2 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-2 w-12 rounded-full bg-gray-100" />
        ))}
      </div>
      <div className="space-y-6">
        <div className="h-12 w-full rounded-lg bg-gray-100" />
        <div className="h-32 w-full rounded-lg bg-gray-100" />
        <div className="h-12 w-full rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
