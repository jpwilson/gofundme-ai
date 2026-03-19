export default function GivingAgentLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto h-10 w-80 rounded-lg bg-white/60" />
          <div className="mx-auto mt-4 h-6 w-96 max-w-full rounded-lg bg-white/40" />
          <div className="mt-8 flex justify-center gap-4">
            <div className="h-12 w-48 rounded-full bg-white/50" />
          </div>
        </div>
      </div>
      <div className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
