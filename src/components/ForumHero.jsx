export default function ForumHero() {
  return (
    <div className="relative bg-[#0b0d12] border-b border-white/10">
      {/* SUBTLE GRADIENT ACCENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
        {/* LEFT ACCENT */}
        <div className="flex items-start gap-4">
          <span className="mt-1 h-10 w-1 rounded-full bg-gradient-to-b from-pink-500 to-purple-500" />

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Naomi Forum
            </h1>

            <p className="mt-2 max-w-xl text-sm sm:text-base text-white/60 leading-relaxed">
              A private adult community to share media, discuss openly,
              and react freely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
