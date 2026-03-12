'use client';

import { useEffect, useState, useRef } from 'react';

interface LiveIndicatorProps {
  fetchedAt: string;
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s ago`;
}

export default function LiveIndicator({ fetchedAt }: LiveIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const base = new Date(fetchedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - base) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [fetchedAt]);

  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 select-none">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full bg-green-500 ${prefersReduced.current ? '' : 'animate-pulse'}`}
        aria-hidden="true"
      />
      Online · updated {formatElapsed(elapsed)}
    </span>
  );
}
