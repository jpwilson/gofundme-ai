export default function ProLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Top banner skeleton */}
      <div className="bg-[#e8f5e9] py-2.5 px-4">
        <div className="h-4 w-80 bg-[#c8e6c9] rounded mx-auto" />
      </div>

      {/* Navbar skeleton */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="hidden lg:flex items-center gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-12 bg-gray-100 rounded hidden lg:block" />
            <div className="h-10 w-36 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-[#1a3c2e] py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <div className="h-12 md:h-16 w-3/4 bg-white/10 rounded-lg mx-auto" />
          <div className="h-12 md:h-16 w-1/2 bg-white/10 rounded-lg mx-auto" />
          <div className="h-5 w-2/3 bg-white/5 rounded mx-auto mt-6" />
          <div className="flex justify-center gap-4 mt-10">
            <div className="h-12 w-40 bg-white/10 rounded-full" />
            <div className="h-12 w-40 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Features grid skeleton */}
      <div className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16 space-y-3">
            <div className="h-4 w-20 bg-gray-100 rounded mx-auto" />
            <div className="h-8 w-96 bg-gray-200 rounded mx-auto" />
            <div className="h-5 w-80 bg-gray-100 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-6 space-y-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
