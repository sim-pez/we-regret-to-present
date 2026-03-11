'use client';

import { useEffect, useState } from 'react';

const QUOTE = '"Thank you for your interest. After careful consideration..."';

export default function HeroSection() {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setStarted(true), 1200);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= QUOTE.length) return;
    const t = setTimeout(() => setDisplayed(QUOTE.slice(0, displayed.length + 1)), 40);
    return () => clearTimeout(t);
  }, [started, displayed]);

  return (
    <section className="animate-fade-in-up mb-24 relative pt-6" style={{ animationDelay: '0.05s' }}>
      <div className="relative">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-xs font-mono text-zinc-400 mb-10 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-dot" />
          Personal Data Visualization &nbsp;·&nbsp; Job Search Analytics
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-zinc-50 leading-[1.02] tracking-tight mb-6">
          We Regret to
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #fca5a5 0%, #f87171 35%, #ef4444 65%, #dc2626 100%)',
            }}
          >
            Inform You.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-14">
          A brutally honest accounting of job applications — their outcomes, and what the numbers
          say about the market (or me).
        </p>

        {/* Typewriter quote */}
        <p className="font-mono text-zinc-700 text-sm mt-12 italic min-h-[1.25rem]">
          {displayed}
          {displayed.length < QUOTE.length && started && (
            <span className="animate-blink-cursor border-r border-zinc-600 ml-px" />
          )}
        </p>
      </div>
    </section>
  );
}
