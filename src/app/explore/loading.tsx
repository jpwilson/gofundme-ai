export default function ExploreLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80 mx-auto" />
        <p className="text-white/60 text-sm">Loading 3D visualization...</p>
      </div>
    </div>
  );
}
