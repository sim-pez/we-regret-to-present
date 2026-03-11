import { pool } from './db';
import {
  computeRejectionStreaks,
  computePainIndex,
  computeRejectionRate,
  computeGhostingRate,
} from './metrics';

export interface WordCloudWord {
  word: string;
  count: number;
}

export interface ApplicationMetrics {
  total: number;
  rejected: number;
  interviewing: number;
  ghosted: number;
  rejectionRate: string;
  ghostingRate: string;
  painIndex: string;
  fastestCompany: string;
  fastestDays: number;
  slowestCompany: string;
  slowestDays: number;
  avgDays: number;
  peakWeekStart: string;
  peakWeekCount: number;
  mostInOneDay: number;
  mostInOneDayDate: string;
  avgPerWeek: string;
  currentStreak: number;
  longestStreak: number;
}

export async function logEnumValues(): Promise<void> {
  try {
    const result = await pool.query(`
      SELECT enumlabel FROM pg_enum
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
      WHERE pg_type.typname = 'application_status'
      ORDER BY enumsortorder
    `);
    console.log(
      '[rejectlytics] application_status enum values:',
      result.rows.map((r) => r.enumlabel)
    );
  } catch (err) {
    console.warn('[rejectlytics] Could not fetch enum values:', err);
  }
}

export async function getWordCloudData(): Promise<WordCloudWord[]> {
  const result = await pool.query<WordCloudWord>(
    `SELECT word, count::int FROM word_count ORDER BY count DESC LIMIT 150`
  );
  return result.rows;
}

export async function getApplicationMetrics(): Promise<ApplicationMetrics> {
  // Core counts
  const countsResult = await pool.query<{
    total: string;
    rejected: string;
    interviewing: string;
    ghosted: string;
  }>(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE CAST(status AS text) ILIKE '%reject%') AS rejected,
      COUNT(*) FILTER (WHERE CAST(status AS text) ILIKE '%interview%') AS interviewing,
      COUNT(*) FILTER (
        WHERE CAST(status AS text) ILIKE '%applied%'
          AND applied_at < NOW() - INTERVAL '20 days'
      ) AS ghosted
    FROM application
  `);
  const counts = countsResult.rows[0];
  const total = parseInt(counts.total, 10);
  const rejected = parseInt(counts.rejected, 10);
  const interviewing = parseInt(counts.interviewing, 10);
  const ghosted = parseInt(counts.ghosted, 10);

  // Rejection speed
  const speedResult = await pool.query<{
    company: string;
    days: string;
  }>(`
    SELECT
      company,
      EXTRACT(EPOCH FROM (rejected_at - applied_at)) / 86400 AS days
    FROM application
    WHERE rejected_at IS NOT NULL AND applied_at IS NOT NULL
      AND CAST(status AS text) ILIKE '%reject%'
    ORDER BY days ASC
  `);
  const speedRows = speedResult.rows;

  const fastestRow = speedRows[0] ?? { company: 'N/A', days: '0' };
  const slowestRow = speedRows[speedRows.length - 1] ?? { company: 'N/A', days: '0' };
  const avgDays =
    speedRows.length > 0
      ? speedRows.reduce((sum, r) => sum + parseFloat(r.days), 0) / speedRows.length
      : 0;

  // Peak rejection week
  const peakWeekResult = await pool.query<{ week_start: string; count: string }>(`
    SELECT DATE_TRUNC('week', rejected_at)::text AS week_start, COUNT(*) AS count
    FROM application
    WHERE rejected_at IS NOT NULL AND CAST(status AS text) ILIKE '%reject%'
    GROUP BY DATE_TRUNC('week', rejected_at)
    ORDER BY count DESC
    LIMIT 1
  `);
  const peakWeek = peakWeekResult.rows[0] ?? { week_start: 'N/A', count: '0' };

  // Most in one day
  const mostOneDayResult = await pool.query<{ day: string; count: string }>(`
    SELECT DATE(rejected_at)::text AS day, COUNT(*) AS count
    FROM application
    WHERE rejected_at IS NOT NULL AND CAST(status AS text) ILIKE '%reject%'
    GROUP BY DATE(rejected_at)
    ORDER BY count DESC
    LIMIT 1
  `);
  const mostOneDay = mostOneDayResult.rows[0] ?? { day: 'N/A', count: '0' };

  // Avg per week
  const spanResult = await pool.query<{ weeks: string }>(`
    SELECT
      GREATEST(
        EXTRACT(EPOCH FROM (MAX(rejected_at) - MIN(rejected_at))) / 604800,
        1
      ) AS weeks
    FROM application
    WHERE rejected_at IS NOT NULL AND CAST(status AS text) ILIKE '%reject%'
  `);
  const weeks = parseFloat(spanResult.rows[0]?.weeks ?? '1');
  const avgPerWeek = (rejected / weeks).toFixed(1);

  // Streak data
  const streakResult = await pool.query<{ rejected_at: Date | null }>(`
    SELECT rejected_at
    FROM application
    WHERE rejected_at IS NOT NULL AND CAST(status AS text) ILIKE '%reject%'
    ORDER BY rejected_at DESC
  `);
  const { current: currentStreak, longest: longestStreak } = computeRejectionStreaks(
    streakResult.rows
  );

  return {
    total,
    rejected,
    interviewing,
    ghosted,
    rejectionRate: computeRejectionRate(rejected, total),
    ghostingRate: computeGhostingRate(ghosted, total),
    painIndex: computePainIndex(rejected, interviewing),
    fastestCompany: fastestRow.company,
    fastestDays: parseFloat(fastestRow.days),
    slowestCompany: slowestRow.company,
    slowestDays: parseFloat(slowestRow.days),
    avgDays: avgDays,
    peakWeekStart: peakWeek.week_start,
    peakWeekCount: parseInt(peakWeek.count, 10),
    mostInOneDay: parseInt(mostOneDay.count, 10),
    mostInOneDayDate: mostOneDay.day,
    avgPerWeek,
    currentStreak,
    longestStreak,
  };
}
