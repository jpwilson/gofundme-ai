export default function FundraiserLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 animate-pulse">
      {/* Title skeleton */}
      <div className="mb-6 h-8 w-3/4 rounded bg-gray-200" />

      {/* Two-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column */}
        <div className="w-full space-y-8 lg:w-[60%]">
          {/* Image skeleton */}
          <div className="aspect-video w-full rounded-lg bg-gray-200" />

          {/* Description lines */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-4/6 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>

          {/* Organizer section skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Right column - Donation sidebar skeleton */}
        <div className="w-full lg:w-[40%]">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm space-y-5">
            {/* Amount raised */}
            <div className="h-7 w-48 rounded bg-gray-200" />
            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-gfm-bg" />
            {/* Stats row */}
            <div className="flex gap-4">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
            </div>
            {/* Buttons */}
            <div className="h-12 w-full rounded-full bg-gray-200" />
            <div className="h-12 w-full rounded-full bg-gfm-bg" />
            {/* Donation list */}
            <div className="space-y-4 pt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-gray-200" />
                    <div className="h-3 w-16 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
