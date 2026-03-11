'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3Cloud from 'd3-cloud';
import { scaleLinear } from 'd3-scale';
import { interpolateReds } from 'd3-scale-chromatic';

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
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.offsetWidth, height: 500 });
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

    const fontSizeScale = scaleLinear().domain([minCount, maxCount]).range([12, 80]).clamp(true);

    const layout = d3Cloud.default()
      .size([dimensions.width, dimensions.height])
      .words(
        words.map((w) => ({
          text: w.word,
          size: fontSizeScale(w.count),
          originalCount: w.count,
        }))
      )
      .padding(4)
      .rotate(() => (Math.random() < 0.7 ? 0 : Math.random() < 0.5 ? 90 : -90))
      .font('Playfair Display, serif')
      .fontSize((d) => (d as CloudWord).size)
      .on('end', (output) => {
        setCloudWords(output as CloudWord[]);
        setIsReady(true);
      });

    layout.start();
  }, [dimensions.width, dimensions.height, words]);

  const counts = words.map((w) => w.count);
  const minCount = counts.length > 0 ? Math.min(...counts) : 0;
  const maxCount = counts.length > 0 ? Math.max(...counts) : 1;
  const colorScale = scaleLinear<number>()
    .domain([minCount, maxCount])
    .range([0.2, 0.9])
    .clamp(true);

  return (
    <div ref={containerRef} className="w-full">
      {!isReady && (
        <div className="w-full h-[500px] rounded-xl border border-white/8 animate-pulse flex items-center justify-center">
          <span className="text-zinc-600 font-mono text-sm">computing rejection vocabulary...</span>
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
            {cloudWords.map((word, i) => (
              <text
                key={word.text}
                className="word-reveal"
                style={{
                  fontSize: `${word.size}px`,
                  fontFamily: 'Playfair Display, serif',
                  fill: interpolateReds(colorScale(word.originalCount)),
                  cursor: 'default',
                  animationDelay: `${Math.min(i * 22, 800)}ms`,
                }}
                textAnchor="middle"
                transform={`translate(${word.x ?? 0},${word.y ?? 0}) rotate(${word.rotate ?? 0})`}
              >
                <title>{`${word.text}: ${word.originalCount}`}</title>
                {word.text}
              </text>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
