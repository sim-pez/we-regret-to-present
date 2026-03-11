'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3Cloud from 'd3-cloud';
import { scaleLinear } from 'd3-scale';

interface Word {
  word: string;
  count: number;
}

interface CloudWord extends d3Cloud.Word {
  text: string;
  size: number;
  originalCount: number;
}

interface WordCloudProps {
  words: Word[];
}

// Multi-stop muted palette: dark navy → dusty mauve → muted amber → sage → warm stone
const PALETTE: [number, number, number][] = [
  [52,  56,  75],   // 0.00 — dark muted navy
  [101, 80,  101],  // 0.25 — dusty mauve/purple
  [122, 100, 65],   // 0.50 — muted amber/sand
  [100, 155, 140],  // 0.75 — muted sage/teal
  [231, 229, 228],  // 1.00 — warm stone-200
];

function paletteColor(t: number): string {
  const n = PALETTE.length - 1;
  const scaled = t * n;
  const i = Math.min(Math.floor(scaled), n - 1);
  const u = scaled - i;
  const [r1, g1, b1] = PALETTE[i];
  const [r2, g2, b2] = PALETTE[i + 1];
  return `rgb(${Math.round(r1 + u * (r2 - r1))},${Math.round(g1 + u * (g2 - g1))},${Math.round(b1 + u * (b2 - b1))})`;
}

export default function WordCloud({ words }: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cloudWords, setCloudWords] = useState<CloudWord[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 520 });
  const [isReady, setIsReady] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; word: string; count: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.offsetWidth, height: 520 });
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || words.length === 0) return;

    const counts = words.map((w) => w.count);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    const fontSizeScale = scaleLinear().domain([minCount, maxCount]).range([12, 88]).clamp(true);

    const layout = d3Cloud.default()
      .size([dimensions.width, dimensions.height])
      .words(
        words.map((w) => ({
          text: w.word,
          size: fontSizeScale(w.count),
          originalCount: w.count,
        }))
      )
      .padding(5)
      .rotate(() => (Math.random() < 0.65 ? 0 : Math.random() < 0.5 ? 90 : -90))
      .font('Playfair Display, serif')
      .fontSize((d) => (d as CloudWord).size)
      .on('end', (output) => {
        const sorted = [...output].sort(
          (a, b) => (a as CloudWord).originalCount - (b as CloudWord).originalCount
        );
        setCloudWords(sorted as CloudWord[]);
        setIsReady(true);
      });

    layout.start();
  }, [dimensions.width, dimensions.height, words]);

  const counts = words.map((w) => w.count);
  const minCount = counts.length > 0 ? Math.min(...counts) : 0;
  const maxCount = counts.length > 0 ? Math.max(...counts) : 1;

  const colorScale = scaleLinear<number>()
    .domain([minCount, maxCount])
    .range([0.05, 1])
    .clamp(true);

  const weightScale = scaleLinear()
    .domain([minCount, maxCount])
    .range([300, 700])
    .clamp(true);

  const isAnyHovered = hoveredWord !== null;

  return (
    <div ref={containerRef} className="w-full relative">
      {!isReady && (
        <div className="w-full h-[520px] flex items-center justify-center">
          <span className="text-zinc-700 font-mono text-sm">computing rejection vocabulary...</span>
        </div>
      )}
      {isReady && cloudWords.length > 0 && (
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
          aria-label="Word cloud of rejection letter vocabulary"
        >
          <g transform={`translate(${dimensions.width / 2},${dimensions.height / 2})`}>
            {cloudWords.map((word) => {
              const isHovered = hoveredWord === word.text;
              const dimmed = isAnyHovered && !isHovered;
              const fill = isHovered ? '#f5f5f4' : paletteColor(colorScale(word.originalCount));
              const fontWeight = Math.round(weightScale(word.originalCount) / 100) * 100;
              const isSmall = (word.size ?? 0) < 22;

              return (
                <text
                  key={word.text}
                  style={{
                    fontSize: `${word.size}px`,
                    fontFamily: 'Playfair Display, serif',
                    fontWeight,
                    fontStyle: isSmall ? 'italic' : 'normal',
                    fill,
                    opacity: dimmed ? 0.2 : 1,
                    cursor: 'default',
                    transition: 'fill 0.2s ease, opacity 0.2s ease',
                    userSelect: 'none',
                  }}
                  textAnchor="middle"
                  transform={`translate(${word.x ?? 0},${word.y ?? 0}) rotate(${word.rotate ?? 0})`}
                  onMouseEnter={(e) => {
                    setHoveredWord(word.text);
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        word: word.text,
                        count: word.originalCount,
                      });
                    }
                  }}
                  onMouseMove={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect && tooltip) {
                      setTooltip((t) => t && { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredWord(null);
                    setTooltip(null);
                  }}
                >
                  <title>{`"${word.text}" — ${word.originalCount}`}</title>
                  {word.text}
                </text>
              );
            })}
          </g>
        </svg>
      )}
      {tooltip && (
        <div
          key={tooltip.word}
          className="wc-tooltip-pop pointer-events-none absolute z-50 font-mono"
          style={{ left: tooltip.x + 16, top: tooltip.y - 44 }}
        >
          <span className="inline-block bg-zinc-950 border border-zinc-700 text-zinc-300 text-base font-bold px-3 py-1 rounded-sm whitespace-nowrap tracking-widest">
            {tooltip.count}
          </span>
        </div>
      )}
    </div>
  );
}
