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
      className="animate-fade-in-up col-span-1 md:col-span-2 relative rounded-xl overflow-hidden group cursor-default"
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-amber-700/10 to-transparent group-hover:from-amber-400/50 group-hover:via-amber-600/15 transition-all duration-500 rounded-xl" />
      <div className="absolute inset-[1px] bg-[#0d1117] rounded-[11px]" />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: '0 0 40px -8px rgba(245, 158, 11, 0.2)' }}
      />

      {/* Inner decorative frame */}
      <div className="absolute inset-4 border border-amber-500/8 rounded-lg pointer-events-none group-hover:border-amber-500/16 transition-colors duration-300" />

      <div className="relative z-10 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500/70 font-mono mb-3 flex items-center gap-2">
          <span>🏆</span>
          Speed Record — Certificate of Distinction
        </p>
        <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
          This certifies that the following organization demonstrated exceptional efficiency in
          talent rejection:
        </p>
        <p className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">{company}</p>
        <p className="text-zinc-400 text-sm">
          achieved rejection in{' '}
          <span className="font-mono text-red-400 font-bold">{hoursOrDays}</span> — a feat of
          administrative excellence.
        </p>
        <p className="text-xs text-zinc-700 font-mono italic mt-4">
          &ldquo;We were impressed by your background, but unfortunately...&rdquo;
        </p>
      </div>
    </div>
  );
}
