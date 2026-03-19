export default function CampaignBuilderLoading() {
  return (
    <div className="min-h-screen bg-gfm-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title skeleton */}
        <div className="h-9 w-72 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />

        {/* Step indicator skeleton */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-2 bg-gray-200 rounded-full mb-4 animate-pulse" />
          <div className="flex justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse hidden sm:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-5 w-80 bg-gray-200 rounded animate-pulse mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>

          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex justify-end">
          <div className="h-12 w-36 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
