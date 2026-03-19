export default function FraudDetectionLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
      <div className="mb-8 h-8 w-56 rounded-lg bg-gray-100" />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-gray-100" />
    </div>
  );
}
