interface HeroSectionProps {
  totalApplications: number;
  totalRejected: number;
}

export default function HeroSection({ totalApplications, totalRejected }: HeroSectionProps) {
  return (
    <section className="animate-fade-in-up mb-16 relative" style={{ animationDelay: '0.05s' }}>
      {/* Background glow blob */}
      <div
        aria-hidden
        className="absolute -top-16 -left-16 w-[500px] h-72 bg-red-900/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative py-6">
        <p className="text-xs uppercase tracking-[0.25em] text-red-500/60 font-mono mb-8 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-red-500/50" />
          A Personal Data Visualization
        </p>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-zinc-100 leading-[1.08] tracking-tight mb-6">
          We Regret to
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #fca5a5, #ef4444, #dc2626)',
            }}
          >
            Inform You
          </span>
        </h1>

        <p className="text-zinc-400 font-serif text-xl md:text-2xl leading-relaxed max-w-2xl mb-8">
          An honest accounting of{' '}
          <span className="font-mono text-zinc-100 font-bold not-italic">{totalApplications}</span>{' '}
          job applications — their outcomes, and what the data says about the market (or me).
        </p>

        <div className="flex items-center gap-5">
          <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-red-500/40 to-transparent" />
          <p className="font-mono text-zinc-400 text-sm whitespace-nowrap">
            <span className="text-red-400 font-bold text-3xl tabular-nums">{totalRejected}</span>
            <span className="ml-2 text-zinc-500">rejections on record</span>
          </p>
          <div className="h-px w-6 bg-zinc-800" />
        </div>

        <p className="font-serif italic text-zinc-700 text-sm mt-5">
          &ldquo;Thank you for your interest in this position. After careful consideration...&rdquo;
        </p>
      </div>
    </section>
  );
}
