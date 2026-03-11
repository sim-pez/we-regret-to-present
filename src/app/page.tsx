import { getWordCloudData, getApplicationMetrics, logEnumValues } from '@/lib/queries';
import HeroSection from '@/components/HeroSection';
import MetricsGrid from '@/components/MetricsGrid';
import WordCloud from '@/components/WordCloud';
import DisclaimerSection from '@/components/DisclaimerSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Log enum values on load (dev diagnostic)
  logEnumValues().catch(console.error);

  const [words, metrics] = await Promise.all([getWordCloudData(), getApplicationMetrics()]);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 md:px-8 md:py-16 max-w-5xl mx-auto">
      <HeroSection totalApplications={metrics.total} totalRejected={metrics.rejected} />

      {/* Word Cloud Section */}
      <section className="animate-fade-in-up mb-14" style={{ animationDelay: '0.15s' }}>
        <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono mb-3 flex items-center gap-3">
          <span className="h-px w-3 bg-zinc-700" />
          The Vocabulary of Rejection
        </h2>
        <p className="text-zinc-600 font-serif italic text-sm mb-4">
          Words extracted from rejection emails, sized by frequency.
        </p>
        <div className="border border-white/8 bg-white/[0.02] rounded-xl p-4">
          <WordCloud words={words} />
        </div>
      </section>

      {/* Metrics Section */}
      <section className="mb-14">
        <MetricsGrid metrics={metrics} />
      </section>

      <DisclaimerSection />
    </main>
  );
}
