import { MailHistoryEntry } from '@/lib/queries';

const BADGE: Record<MailHistoryEntry['classification'], { label: string; color: string }> = {
  rejection: { label: 'REJECTION', color: 'text-red-400' },
  other:     { label: 'OTHER',     color: 'text-zinc-600' },
};

function formatDate(iso: string): { day: string; time: string } {
  const date = new Date(iso);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday)     return { day: 'today',     time };
  if (isYesterday) return { day: 'yesterday', time };
  const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  return { day: `${month} ${String(date.getDate()).padStart(2, '0')}`, time };
}

interface RecentMailFeedProps {
  emails: MailHistoryEntry[];
}

export default function RecentMailFeed({ emails }: RecentMailFeedProps) {
  return (
    <div className="font-mono text-xs px-4">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto] pb-1.5 mb-1 border-b border-zinc-800 text-zinc-600 uppercase tracking-widest">
        <span>received</span>
        <span className="text-right">ai classification</span>
      </div>

      {/* Rows */}
      {emails.length === 0 ? (
        <div className="py-4 text-zinc-600 text-center">no mail yet.</div>
      ) : (
        <div className="grid grid-cols-[auto_auto_1fr] tabular-nums text-zinc-600">
          {emails.map((email) => {
            const badge = BADGE[email.classification];
            const { day, time } = formatDate(email.receivedAt);
            return (
              <div key={email.id} className="contents">
                <span className="py-2 pr-6 border-b border-zinc-800/50">{day}</span>
                <span className="py-2 pr-4 border-b border-zinc-800/50">{time}</span>
                <span className={`${badge.color} font-semibold tracking-wide py-2 text-right border-b border-zinc-800/50`}>{badge.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-zinc-800 text-zinc-600 tracking-wide">
        Live feed from the rejection machine.
      </div>
    </div>
  );
}
