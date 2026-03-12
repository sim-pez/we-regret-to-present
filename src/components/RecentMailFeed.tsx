export interface MailEntry {
  id: string;
  receivedAt: string; // ISO
  classification: 'rejection' | 'not_job_related';
}

const MOCK_EMAILS: MailEntry[] = [
  { id: '1',  receivedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),         classification: 'rejection' },
  { id: '2',  receivedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),         classification: 'not_job_related' },
  { id: '3',  receivedAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),         classification: 'not_job_related' },
  { id: '4',  receivedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),        classification: 'rejection' },
  { id: '5',  receivedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),        classification: 'rejection' },
  { id: '6',  receivedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),        classification: 'not_job_related' },
  { id: '7',  receivedAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),        classification: 'rejection' },
  { id: '8',  receivedAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),        classification: 'not_job_related' },
  { id: '9',  receivedAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),        classification: 'rejection' },
  { id: '10', receivedAt: new Date(Date.now() - 6.5 * 86400 * 1000).toISOString(),      classification: 'rejection' },
];

const BADGE: Record<MailEntry['classification'], { label: string; color: string }> = {
  rejection:       { label: 'REJECTION', color: 'text-red-400' },
  not_job_related: { label: 'OTHER',    color: 'text-zinc-600' },
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
  emails?: MailEntry[];
}

export default function RecentMailFeed({ emails = MOCK_EMAILS }: RecentMailFeedProps) {
  return (
    <div className="font-mono text-xs px-4">
      {/* Column headers */}
      <div className="grid grid-cols-[auto_auto_1fr] gap-x-4 pb-1.5 mb-1 border-b border-zinc-800 text-zinc-600 uppercase tracking-widest">
        <span className="col-span-2">received</span>
        <span className="text-right">ai classification</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-800/50">
        {emails.map((email) => {
          const badge = BADGE[email.classification];
          const { day, time } = formatDate(email.receivedAt);
          return (
            <div
              key={email.id}
              className="grid grid-cols-[auto_auto_1fr] gap-x-4 py-2 items-center text-zinc-600 tabular-nums"
            >
              <span>{day}</span>
              <span>{time}</span>
              <span className={`${badge.color} font-semibold tracking-wide text-right`}>{badge.label}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-zinc-800 text-zinc-600 tracking-wide">
        Live feed from the rejection machine.
      </div>
    </div>
  );
}
