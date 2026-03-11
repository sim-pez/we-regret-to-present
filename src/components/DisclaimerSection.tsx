export default function DisclaimerSection() {
  return (
    <div className="border-t border-zinc-800 pt-8 mt-8">
      <p className="text-xs text-zinc-500 font-serif italic max-w-2xl">
        This is a personal data visualization project and humor exercise. No real harm intended to
        any of the companies listed or implied. If you&apos;re a recruiter who stumbled here: hi,
        I&apos;m available.
      </p>
      <p className="text-xs text-zinc-600 font-mono mt-2">
        Source code:{' '}
        <span className="text-zinc-500">[TODO: add GitHub repo URL]</span>
      </p>
    </div>
  );
}
