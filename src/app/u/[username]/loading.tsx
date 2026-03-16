export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-[680px] px-4 pb-16 animate-pulse">
      {/* Banner */}
      <div className="h-48 w-full rounded-t-lg bg-gray-200" />

      {/* Avatar */}
      <div className="flex justify-center">
        <div className="-mt-16 h-32 w-32 rounded-full border-4 border-white bg-gray-200" />
      </div>

      {/* Name and location */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 bg-white p-4"
          >
            <div className="h-6 w-12 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Highlights section */}
      <div className="mt-8 space-y-4">
        <div className="h-5 w-28 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>

      {/* Activity section */}
      <div className="mt-8 space-y-4">
        <div className="h-5 w-24 rounded bg-gray-200" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-4">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
