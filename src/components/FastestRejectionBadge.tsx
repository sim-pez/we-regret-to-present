interface FastestRejectionBadgeProps {
  company: string;
  days: number;
  animationDelay?: string;
}

export default function FastestRejectionBadge({
  company,
  days,
  animationDelay,
}: FastestRejectionBadgeProps) {
  const hoursOrDays = days === 0 ? 'same day' : days === 1 ? '1 day' : `${days} days`;

  return (
    <div
      className="animate-fade-in-up col-span-1 md:col-span-2 relative rounded-xl overflow-hidden group"
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* Gradient border via pseudo-wrapper */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/60 via-amber-600/30 to-amber-800/60 group-hover:from-amber-400/80 group-hover:to-amber-700/80 transition-all duration-500 rounded-xl" />
      <div className="absolute inset-[1px] bg-zinc-950 rounded-xl" />

      {/* Inner decorative frame */}
      <div className="absolute inset-4 border border-amber-500/10 rounded-lg pointer-events-none group-hover:border-amber-500/20 transition-colors duration-300" />

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-amber-900/10 group-hover:bg-amber-900/20 transition-colors duration-300 rounded-xl" />

      <div className="relative z-10 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 font-mono mb-3 flex items-center gap-2">
          <span>🏆</span>
          Speed Record — Certificate of Distinction
        </p>
        <p className="text-zinc-500 font-serif text-sm mb-4 leading-relaxed">
          This certifies that the following organization demonstrated exceptional efficiency in
          talent rejection:
        </p>
        <p className="text-2xl md:text-3xl font-serif font-bold text-amber-400 mb-2">{company}</p>
        <p className="text-zinc-400 font-serif text-sm">
          achieved rejection in{' '}
          <span className="font-mono text-red-400 font-bold">{hoursOrDays}</span> — a feat of
          administrative excellence.
        </p>
        <p className="text-xs text-zinc-700 font-serif italic mt-4">
          &ldquo;We were impressed by your background, but unfortunately...&rdquo;
        </p>
      </div>
    </div>
  );
}
