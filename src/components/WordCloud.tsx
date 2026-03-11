'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3Cloud from 'd3-cloud';
import { scaleLinear } from 'd3-scale';
import { interpolateInferno } from 'd3-scale-chromatic';

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
        // Render low-frequency words first so high-frequency sit on top
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

  // inferno: 0.25 = deep purple-red, 0.92 = hot orange-yellow
  const colorScale = scaleLinear<number>()
    .domain([minCount, maxCount])
    .range([0.25, 0.92])
    .clamp(true);

  const glowScale = scaleLinear()
    .domain([minCount, maxCount])
    .range([0, 1])
    .clamp(true);

  const weightScale = scaleLinear()
    .domain([minCount, maxCount])
    .range([300, 700])
    .clamp(true);

  const isAnyHovered = hoveredWord !== null;

  return (
    <div ref={containerRef} className="w-full relative">
      {!isReady && (
        <div className="w-full h-[520px] animate-pulse flex items-center justify-center">
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
          <defs>
            <filter id="wc-glow-sm" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="wc-glow-md" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="wc-glow-lg" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="wc-glow-hover" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0.9  0 0.3 0 0 0.1  0 0 0 0 0  0 0 0 1.5 0"
                result="coloredBlur"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="wc-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.18" />
              <stop offset="55%" stopColor="#7f1d1d" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Subtle radial background glow */}
          <ellipse
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            rx={dimensions.width * 0.44}
            ry={dimensions.height * 0.44}
            fill="url(#wc-bg)"
          />

          <g transform={`translate(${dimensions.width / 2},${dimensions.height / 2})`}>
            {cloudWords.map((word, i) => {
              const glow = glowScale(word.originalCount);
              const isHovered = hoveredWord === word.text;
              const dimmed = isAnyHovered && !isHovered;

              let filter: string | undefined;
              if (isHovered) {
                filter = 'url(#wc-glow-hover)';
              } else if (glow > 0.7) {
                filter = 'url(#wc-glow-lg)';
              } else if (glow > 0.4) {
                filter = 'url(#wc-glow-md)';
              } else if (glow > 0.15) {
                filter = 'url(#wc-glow-sm)';
              }

              const baseColor = interpolateInferno(colorScale(word.originalCount));
              const fill = isHovered ? '#fff' : baseColor;
              const fontWeight = Math.round(weightScale(word.originalCount) / 100) * 100;
              const isSmall = (word.size ?? 0) < 22;

              return (
                <text
                  key={word.text}
                  className="word-reveal"
                  style={{
                    fontSize: `${word.size}px`,
                    fontFamily: 'Playfair Display, serif',
                    fontWeight,
                    fontStyle: isSmall ? 'italic' : 'normal',
                    fill,
                    filter,
                    opacity: dimmed ? 0.2 : 1,
                    cursor: 'default',
                    animationDelay: `${Math.min(i * 16, 900)}ms`,
                    transition: 'fill 0.25s ease, opacity 0.25s ease',
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
          <span
            className="inline-block bg-zinc-950 border border-orange-500/60 text-orange-300 text-base font-bold px-3 py-1 rounded-sm whitespace-nowrap tracking-widest"
            style={{ boxShadow: '0 0 12px rgba(249,115,22,0.5), 0 0 32px rgba(249,115,22,0.18)' }}
          >
            {tooltip.count}
          </span>
        </div>
      )}
    </div>
  );
}
