import { formatDuration } from '@/lib/metrics';

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
  const hoursOrDays = formatDuration(days);

  return (
    <div
      className="animate-fade-in-up w-full relative rounded-xl group cursor-default"
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-amber-700/10 to-transparent group-hover:from-amber-400/50 group-hover:via-amber-600/15 transition-all duration-500 rounded-xl" />
      <div className="absolute inset-[1px] bg-[#0d1117] rounded-[11px]" />

      {/* Glow — breathes at rest, full intensity on hover */}
      <div
        className="absolute inset-0 rounded-xl animate-card-breathe group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: '0 0 40px -8px rgba(245, 158, 11, 0.2)' }}
      />

      <div className="relative z-10 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500/70 font-mono mb-3 flex items-center gap-2">
          <span>🏆</span>
          Speed Record — Certificate of Distinction
        </p>
        <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
          This certifies that the following organization demonstrated exceptional efficiency in
          talent rejection:
        </p>
        <div className="relative inline-block group/paywall mb-3 cursor-help">
          <p className="text-2xl md:text-3xl font-bold font-mono text-amber-400 leading-none tracking-widest">
            {company.charAt(0)}<span className="text-zinc-700">{'█'.repeat(Math.min(company.length - 1, 19))}</span>
          </p>
          <p className="text-xs text-zinc-500 font-mono mt-1">name redacted · {company.length} chars</p>

          {/* Fake paywall popover */}
          <div className="absolute bottom-full left-0 mb-3 w-72 max-w-[calc(100vw-3rem)] bg-[#0d1117] border border-zinc-800 rounded-xl shadow-2xl opacity-0 group-hover/paywall:opacity-100 transition-opacity duration-200 [transition-delay:200ms] group-hover/paywall:[transition-delay:0ms] z-50 overflow-hidden">
            {/* Invisible bridge closing the gap so mouse can reach the popover */}
            <div className="absolute -bottom-3 left-0 w-full h-3" />
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent px-4 pt-4 pb-3 border-b border-zinc-800/60">
              <p className="text-xs font-mono uppercase tracking-widest text-amber-500/80 mb-1">🔒 Premium Content</p>
              <p className="text-sm font-semibold text-zinc-200">Unlock the full company name</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-zinc-500 mb-3">
                The full name is available exclusively to employers who{' '}
                <span className="text-amber-400 font-semibold">hire the author of this site</span>.
              </p>
              <div className="flex gap-2 mb-3">
                <a
                  href="mailto:rejectlytics@gmail.com"
                  className="flex-1 text-center text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md px-3 py-1.5 font-semibold hover:bg-amber-500/30 transition-colors duration-150"
                >
                  Hire me
                </a>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono italic">
                * Offer valid until I get a job offer. Void where prohibited by budget freezes.
              </p>
            </div>
          </div>
        </div>
        <p className="text-zinc-400 text-sm">
          achieved rejection in{' '}
          <span className="font-mono text-red-400 font-bold">{hoursOrDays}</span> — a feat of
          administrative excellence.
        </p>
        <p className="text-xs text-zinc-500 font-mono italic mt-4">
          &ldquo;We were impressed by your background, but unfortunately...&rdquo;
        </p>
      </div>
    </div>
  );
}
