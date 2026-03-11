'use client';

import { useEffect, useState } from 'react';
import { formatDurationFromSeconds } from '@/lib/metrics';

interface TimeSinceRejectionProps {
  lastRejectedAt: string; // ISO string
}

export default function TimeSinceRejection({ lastRejectedAt }: TimeSinceRejectionProps) {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!lastRejectedAt) return;
    const MAX_SECONDS = 999 * 86400 + 23 * 3600 + 59 * 60 + 59;
    const base = new Date(lastRejectedAt).getTime();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - base) / 1000);
      if (elapsed >= MAX_SECONDS) {
        setSeconds(MAX_SECONDS);
        clearInterval(id);
      } else {
        setSeconds(elapsed);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastRejectedAt]);

  const display = seconds === null ? '—' : formatDurationFromSeconds(seconds);

  return (
    <div className="relative group overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-default">
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/7 via-white/2 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Dark background */}
      <div className="absolute inset-[1px] rounded-[11px] bg-[#0d1117]" />

      {/* Content */}
      <div className="relative z-10 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 mb-3 font-mono">
          Time Since Last Rejection
        </p>
        <p className="text-3xl font-mono font-bold tabular-nums leading-none text-zinc-100">
          {display}
        </p>
        <p className="text-xs text-zinc-600 mt-2.5 leading-relaxed font-mono">
          and counting...
        </p>
      </div>
    </div>
  );
}
