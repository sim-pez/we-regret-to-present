'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedValueProps {
  value: string | number;
  valueClass: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function parseValue(value: string | number): { target: number; suffix: string; decimals: number } | null {
  if (typeof value === 'number') {
    const decimals = Number.isInteger(value) ? 0 : 1;
    return { target: value, suffix: '', decimals };
  }
  const str = String(value);
  // Percentage: "72%"
  if (str.endsWith('%')) {
    const n = parseFloat(str);
    if (!isNaN(n)) return { target: n, suffix: '%', decimals: Number.isInteger(n) ? 0 : 1 };
  }
  // Days suffix: "7d", "12d"
  const dMatch = str.match(/^(\d+)d$/);
  if (dMatch) return { target: parseInt(dMatch[1]), suffix: 'd', decimals: 0 };
  // Plain number: "8.4", "2.1"
  const numMatch = str.match(/^(\d+(?:\.\d+)?)$/);
  if (numMatch) {
    const n = parseFloat(numMatch[1]);
    return { target: n, suffix: '', decimals: numMatch[1].includes('.') ? 1 : 0 };
  }
  return null;
}

export default function AnimatedValue({ value, valueClass }: AnimatedValueProps) {
  const parsed = parseValue(value);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const hasShimmered = useRef(false);
  const [displayValue, setDisplayValue] = useState<string>(parsed ? '0' + parsed.suffix : String(value));
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (!parsed) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          if (prefersReduced) {
            const final = parsed.decimals > 0
              ? parsed.target.toFixed(parsed.decimals)
              : String(Math.round(parsed.target));
            setDisplayValue(final + parsed.suffix);
            return;
          }

          // Shimmer
          if (!hasShimmered.current) {
            hasShimmered.current = true;
            setShimmer(true);
            setTimeout(() => setShimmer(false), 800);
          }

          // Count-up
          const duration = 900;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = eased * parsed!.target;
            const formatted = parsed!.decimals > 0
              ? current.toFixed(parsed!.decimals)
              : String(Math.round(current));
            setDisplayValue(formatted + parsed!.suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!parsed) {
    return <span className={valueClass}>{value}</span>;
  }

  return (
    <span ref={containerRef} className="relative overflow-hidden inline-block">
      <span className={valueClass}>{displayValue}</span>
      {shimmer && (
        <span
          className="absolute inset-0 pointer-events-none animate-value-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
          }}
        />
      )}
    </span>
  );
}
