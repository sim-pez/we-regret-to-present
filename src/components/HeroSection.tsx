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
    <section className="relative min-h-screen flex flex-col justify-start pt-[18vh] px-6 md:px-12 lg:px-20">
      {/* Solid background — covers body dot grid for a clean distinct look */}
      <div className="absolute inset-0 bg-[#080B10]" />

      {/* Ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-red-900/8 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-red-700/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto animate-fade-in-up pt-6" style={{ animationDelay: '0.05s' }}>
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-xs font-mono text-zinc-400 mb-10 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-dot" />
          Live &nbsp;·&nbsp; Inbox → AI-analysis → DB
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
        <p className="font-mono text-zinc-400 text-sm mt-12 italic min-h-[1.25rem]">
          {displayed}
          {displayed.length < QUOTE.length && started && (
            <span className="animate-blink-cursor border-r border-zinc-600 ml-px" />
          )}
        </p>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none animate-fade-in" style={{ animationDelay: '5s' }}>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-500">scroll</span>
        <svg
          className="animate-scroll-bounce text-zinc-500"
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 4 L8 20 M2 14 L8 20 L14 14" />
        </svg>
      </div>
    </section>
  );
}
