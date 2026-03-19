export default function OnboardLoading() {
  return (
    <div className="min-h-screen bg-[#0d1f1b]">
      {/* Header skeleton */}
      <div className="bg-[#1a3c34] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-6 w-32 bg-white/10 rounded mb-6 animate-pulse" />
          <div className="h-10 w-96 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-5 w-[500px] bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Textarea skeleton */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 animate-pulse">
          <div className="h-4 w-40 bg-white/10 rounded mb-4" />
          <div className="h-40 bg-white/10 rounded-lg mb-4" />
          <div className="h-4 w-60 bg-white/10 rounded mb-4" />
          <div className="h-12 bg-white/10 rounded-lg" />
        </div>

        {/* Example buttons skeleton */}
        <div className="flex gap-3 mb-6">
          <div className="h-9 w-44 bg-white/10 rounded-full animate-pulse" />
          <div className="h-9 w-52 bg-white/10 rounded-full animate-pulse" />
          <div className="h-9 w-40 bg-white/10 rounded-full animate-pulse" />
        </div>

        {/* Submit button skeleton */}
        <div className="h-14 w-52 bg-white/10 rounded-full animate-pulse mx-auto" />
      </div>
    </div>
  );
}
