import StatCard from './StatCard';
import FastestRejectionBadge from './FastestRejectionBadge';
import type { ApplicationMetrics } from '@/lib/queries';

interface MetricsGridProps {
  metrics: ApplicationMetrics;
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono mb-4 flex items-center gap-3">
      <span className="h-px w-3 bg-zinc-700" />
      {children}
    </h2>
  );
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="space-y-10">
      {/* Row 1 — Headlines */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <SectionHeader>The Headline Numbers</SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Rejection Rate"
            value={metrics.rejectionRate}
            subtext={`${metrics.rejected} of ${metrics.total} applications`}
            variant="highlight"
            animationDelay="0.3s"
          />
          <StatCard
            label="Ghosting Rate"
            value={metrics.ghostingRate}
            subtext={`${metrics.ghosted} left on read (20+ days)`}
            variant="warning"
            animationDelay="0.35s"
          />
          <StatCard
            label="Total Applications"
            value={metrics.total}
            subtext="courage, or delusion"
            animationDelay="0.4s"
          />
          <StatCard
            label="Pain Index"
            value={metrics.painIndex}
            subtext="rejections per interview (+1)"
            variant="highlight"
            animationDelay="0.45s"
          />
        </div>
      </div>

      {/* Row 2 — Speed */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <SectionHeader>Rejection Speed</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FastestRejectionBadge
            company={metrics.fastestCompany}
            days={metrics.fastestDays}
            animationDelay="0.55s"
          />
          <StatCard
            label="Avg Time to Rejection"
            value={`${metrics.avgDays}d`}
            subtext="days from apply to despair"
            animationDelay="0.6s"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <StatCard
            label="Slowest Rejection"
            value={`${metrics.slowestDays}d`}
            subtext={metrics.slowestCompany}
            animationDelay="0.65s"
          />
        </div>
      </div>

      {/* Row 3 — Streaks */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <SectionHeader>Streaks &amp; Records</SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Current Streak"
            value={`${metrics.currentStreak}d`}
            subtext="consecutive rejection days"
            variant={metrics.currentStreak >= 3 ? 'highlight' : 'default'}
            animationDelay="0.75s"
          />
          <StatCard
            label="Longest Streak"
            value={`${metrics.longestStreak}d`}
            subtext="personal best (worst)"
            variant="highlight"
            animationDelay="0.8s"
          />
          <StatCard
            label="Peak Rejection Week"
            value={metrics.peakWeekCount}
            subtext={`rejections in one week (${formatDate(metrics.peakWeekStart)})`}
            variant="highlight"
            animationDelay="0.85s"
          />
          <StatCard
            label="Most in One Day"
            value={metrics.mostInOneDay}
            subtext={formatDate(metrics.mostInOneDayDate)}
            animationDelay="0.9s"
          />
        </div>
      </div>

      {/* Row 4 — Trend */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.95s' }}>
        <SectionHeader>Trend</SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Avg Rejections / Week"
            value={metrics.avgPerWeek}
            subtext="consistent, if nothing else"
            animationDelay="1s"
          />
          <StatCard
            label="Currently Interviewing"
            value={metrics.interviewing}
            subtext="optimism not yet crushed"
            animationDelay="1.05s"
          />
        </div>
      </div>
    </div>
  );
}
