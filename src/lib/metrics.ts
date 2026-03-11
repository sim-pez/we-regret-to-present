export interface RejectionRow {
  rejected_at: Date | null;
}

export interface StreakResult {
  current: number;
  longest: number;
}

export function computeRejectionStreaks(rows: RejectionRow[]): StreakResult {
  // rows ordered newest-to-oldest, we walk day by day
  const dates = rows
    .filter((r) => r.rejected_at != null)
    .map((r) => {
      const d = new Date(r.rejected_at!);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    });

  if (dates.length === 0) return { current: 0, longest: 0 };

  // Deduplicate and sort descending
  const unique = Array.from(new Set(dates)).sort((a, b) => b - a);

  const DAY = 86400000;
  const today = new Date();
  const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1;

  // Compute current streak (from today or yesterday backwards)
  const lastRejectionMs = unique[0];
  const daysSinceLastRejection = Math.round((todayMs - lastRejectionMs) / DAY);

  if (daysSinceLastRejection <= 1) {
    currentStreak = 1;
    for (let i = 1; i < unique.length; i++) {
      const diff = Math.round((unique[i - 1] - unique[i]) / DAY);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Compute longest streak
  longestStreak = 1;
  streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = Math.round((unique[i - 1] - unique[i]) / DAY);
    if (diff === 1) {
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else {
      streak = 1;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

export function computePainIndex(rejections: number, interviews: number): string {
  const index = rejections / (interviews + 1);
  return index.toFixed(1);
}

export function computeRejectionRate(rejected: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((rejected / total) * 100)}%`;
}

export function computeGhostingRate(ghosted: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((ghosted / total) * 100)}%`;
}

export function formatDuration(days: number): string {
  const totalSeconds = Math.round(days * 86400);
  if (totalSeconds < 1) return '< 1s';
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0) parts.push(`${s}s`);
  return parts.join(' ') || '< 1s';
}

export function formatDurationFromSeconds(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}
