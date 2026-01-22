export default function PostSkeleton() {
  return (
    <div className="bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-white/10" />
        <div className="h-3 w-32 bg-white/10 rounded" />
      </div>

      <div className="h-[320px] bg-black/40" />

      <div className="px-4 py-4 space-y-2">
        <div className="h-4 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-1/3 bg-white/10 rounded" />
      </div>
    </div>
  );
}
