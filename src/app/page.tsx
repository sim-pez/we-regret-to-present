import { getWordCloudData, getApplicationMetrics, logEnumValues } from '@/lib/queries';
import HeroSection from '@/components/HeroSection';
import MetricsGrid from '@/components/MetricsGrid';
import WordCloud from '@/components/WordCloud';
import DisclaimerSection from '@/components/DisclaimerSection';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Log enum values on load (dev diagnostic)
  logEnumValues().catch(console.error);

  const [words, metrics] = await Promise.all([getWordCloudData(), getApplicationMetrics()]);

  return (
    <>
      <HeroSection />

      <main className="relative z-10 px-6 py-20 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Word Cloud Section */}
        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-mono">
              The Vocabulary of Rejection
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <p className="text-zinc-400 text-sm mb-5 font-mono">
            Words extracted from rejection emails, sized by frequency.
          </p>
          {/* Gradient-border card */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-white/2 to-transparent rounded-2xl" />
            <div className="absolute inset-[1px] bg-[#0d1117] rounded-2xl" />
            <div className="relative z-10 p-4">
              <WordCloud words={words} />
            </div>
          </div>
        </ScrollReveal>

        {/* Metrics Section */}
        <div className="mb-16">
          <MetricsGrid metrics={metrics} />
        </div>

        <DisclaimerSection />
      </main>
    </>
  );
}
