import StatCard from './StatCard';
import FastestRejectionBadge from './FastestRejectionBadge';
import TimeSinceRejection from './TimeSinceRejection';
import ScrollReveal from './ScrollReveal';
import type { ApplicationMetrics } from '@/lib/queries';
import { formatDuration } from '@/lib/metrics';

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
    <div className="flex items-center gap-4 mb-5">
      <h2 className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-mono whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
    </div>
  );
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="space-y-10">
      {/* Row 1 — Headlines */}
      <div>
        <ScrollReveal><SectionHeader>The Headline Numbers</SectionHeader></ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ScrollReveal delay="0s">
            <StatCard
              label="Rejection Rate"
              value={metrics.rejectionRate}
              subtext="of all applications"
              variant="highlight"
            />
          </ScrollReveal>
          <ScrollReveal delay="0.08s">
            <StatCard
              label="Ghosting Rate"
              value={metrics.ghostingRate}
              subtext="left on read (20+ days)"
              variant="warning"
            />
          </ScrollReveal>
          <ScrollReveal delay="0.16s">
            <StatCard
              label="Pain Index"
              value={metrics.painIndex}
              subtext="ratio of pain to hope"
              variant="highlight"
            />
          </ScrollReveal>
        </div>
      </div>

      {/* Row 2 — Speed */}
      <div>
        <ScrollReveal><SectionHeader>Rejection Speed</SectionHeader></ScrollReveal>
        <ScrollReveal delay="0s" className="mb-3">
          <FastestRejectionBadge
            company={metrics.fastestCompany}
            days={metrics.fastestDays}
          />
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ScrollReveal delay="0.08s">
            <StatCard
              label="Avg Time to Rejection"
              value={formatDuration(metrics.avgDays)}
              subtext="from apply to despair"
            />
          </ScrollReveal>
          <ScrollReveal delay="0.16s">
            <StatCard
              label="Slowest Rejection"
              value={formatDuration(metrics.slowestDays)}
              subtext={`${metrics.slowestCompany.charAt(0)}${'█'.repeat(metrics.slowestCompany.length - 1)} · name redacted`}
            />
          </ScrollReveal>
          <ScrollReveal delay="0.24s">
            <TimeSinceRejection lastRejectedAt={metrics.lastRejectedAt} />
          </ScrollReveal>
        </div>
      </div>

      {/* Row 3 — Streaks */}
      <div>
        <ScrollReveal><SectionHeader>Streaks &amp; Records</SectionHeader></ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ScrollReveal delay="0s">
            <StatCard
              label="Current Streak"
              value={`${metrics.currentStreak}d`}
              subtext="consecutive rejection days"
              variant={metrics.currentStreak >= 3 ? 'highlight' : 'default'}
            />
          </ScrollReveal>
          <ScrollReveal delay="0.08s">
            <StatCard
              label="Longest Streak"
              value={`${metrics.longestStreak}d`}
              subtext="personal best (worst)"
              variant="highlight"
            />
          </ScrollReveal>
          <ScrollReveal delay="0.16s">
            <StatCard
              label="Peak Rejection Week"
              value={metrics.peakWeekCount}
              subtext="rejections in one week"
              variant="highlight"
            />
          </ScrollReveal>
          <ScrollReveal delay="0.24s">
            <StatCard
              label="Most in One Day"
              value={metrics.mostInOneDay}
              subtext={formatDate(metrics.mostInOneDayDate)}
            />
          </ScrollReveal>
        </div>
      </div>

      {/* Row 4 — Trend */}
      <div>
        <ScrollReveal><SectionHeader>Trend</SectionHeader></ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ScrollReveal delay="0s">
            <StatCard
              label="Avg Rejections / Week"
              value={metrics.avgPerWeek}
              subtext="consistent, if nothing else"
            />
          </ScrollReveal>
          <ScrollReveal delay="0.08s">
            <StatCard
              label="Currently Interviewing"
              value={metrics.interviewing}
              subtext="optimism not yet crushed"
            />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
