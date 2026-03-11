interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'default' | 'highlight' | 'warning';
  animationDelay?: string;
}

export default function StatCard({
  label,
  value,
  subtext,
  variant = 'default',
  animationDelay,
}: StatCardProps) {
  const borderClass =
    variant === 'highlight'
      ? 'border-red-500/25 hover:border-red-500/50'
      : variant === 'warning'
        ? 'border-amber-500/25 hover:border-amber-500/50'
        : 'border-white/8 hover:border-white/16';

  const topAccent =
    variant === 'highlight'
      ? 'from-red-500/80 to-red-700/40'
      : variant === 'warning'
        ? 'from-amber-500/80 to-amber-700/40'
        : 'from-zinc-600/60 to-transparent';

  const valueClass =
    variant === 'highlight'
      ? 'text-red-400'
      : variant === 'warning'
        ? 'text-amber-400'
        : 'text-zinc-100';

  return (
    <div
      className={`animate-fade-in-up relative border ${borderClass} bg-white/[0.03] backdrop-blur-sm p-5 rounded-xl transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-xl group overflow-hidden`}
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${topAccent} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-2 font-mono">{label}</p>
      <p className={`text-3xl font-mono font-bold tabular-nums ${valueClass}`}>{value}</p>
      {subtext && <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{subtext}</p>}
    </div>
  );
}
