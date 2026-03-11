export default function DisclaimerSection() {
  return (
    <div className="border-t border-zinc-800/60 pt-8 mt-8">
      <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">
        This is a personal data visualization project and humor exercise. No real harm intended to
        any of the companies listed or implied. If you&apos;re a recruiter who stumbled here: hi,
        I&apos;m available.
      </p>
      <p className="text-xs text-zinc-700 font-mono mt-2">
        Source code:{' '}
        <a
          href="https://github.com/sim-pez/we-regret-to-persist"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 underline underline-offset-2 decoration-zinc-700 hover:decoration-zinc-500"
        >
          github.com/sim-pez/we-regret-to-persist
        </a>
      </p>
    </div>
  );
}
