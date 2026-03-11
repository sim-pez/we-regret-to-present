import AnimatedValue from './AnimatedValue';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'default' | 'highlight' | 'warning';
  animationDelay?: string;
  animated?: boolean;
}

export default function StatCard({
  label,
  value,
  subtext,
  variant = 'default',
  animationDelay,
  animated = false,
}: StatCardProps) {
  const gradientBorder =
    variant === 'highlight'
      ? 'from-red-500/25 via-red-900/10 to-transparent'
      : variant === 'warning'
        ? 'from-amber-500/25 via-amber-900/10 to-transparent'
        : 'from-white/7 via-white/2 to-transparent';

  const valueClass =
    variant === 'highlight'
      ? 'text-red-400'
      : variant === 'warning'
        ? 'text-amber-400'
        : 'text-zinc-100';

  const glowShadow =
    variant === 'highlight'
      ? '0 0 28px -6px rgba(239, 68, 68, 0.18)'
      : variant === 'warning'
        ? '0 0 28px -6px rgba(245, 158, 11, 0.18)'
        : '0 0 28px -6px rgba(255, 255, 255, 0.04)';

  const glowClass =
    variant === 'highlight' || variant === 'warning'
      ? 'animate-card-breathe group-hover:opacity-100 transition-opacity duration-300'
      : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300';

  return (
    <div
      className="animate-fade-in-up relative group overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-default"
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* Gradient border layer */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradientBorder} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
      />
      {/* Dark card background */}
      <div className="absolute inset-[1px] rounded-[11px] bg-[#0d1117]" />

      {/* Glow layer — breathes on accent variants, hover-only on default */}
      <div
        className={`absolute inset-0 rounded-xl ${glowClass}`}
        style={{ boxShadow: glowShadow }}
      />

      {/* Content */}
      <div className="relative z-10 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 mb-3 font-mono">{label}</p>
        <p className={`text-3xl font-mono font-bold tabular-nums leading-none relative overflow-hidden`}>
          {animated
            ? <AnimatedValue value={value} valueClass={valueClass} />
            : <span className={valueClass}>{value}</span>
          }
        </p>
        {subtext && (
          <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed font-mono">{subtext}</p>
        )}
      </div>
    </div>
  );
}
