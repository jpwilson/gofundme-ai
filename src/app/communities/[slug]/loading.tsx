export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Dark header area */}
      <div className="bg-gfm-dark px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-600" />
            <div className="space-y-2">
              <div className="h-7 w-56 rounded bg-gray-600" />
              <div className="h-4 w-36 rounded bg-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="mx-auto max-w-6xl px-4 -mt-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="h-6 w-16 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard area */}
      <div className="mx-auto max-w-6xl px-4 mt-8">
        <div className="h-5 w-32 rounded bg-gray-200 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-gfm-bg p-3">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className="mx-auto max-w-6xl px-4 mt-8 border-b border-gray-200">
        <div className="flex gap-6 pb-3">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-14 rounded bg-gray-200" />
        </div>
      </div>

      {/* Activity feed items */}
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-4">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
