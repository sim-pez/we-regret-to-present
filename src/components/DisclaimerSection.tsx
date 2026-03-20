import ScrollReveal from './ScrollReveal';

export default function DisclaimerSection() {
  return (
    <ScrollReveal>
      <div className="border-t border-zinc-800/60 pt-8 mt-8">
        <p className="text-xs text-zinc-400 leading-relaxed">
          Personal data visualization and humor exercise. No ill will toward any company listed.
          <br />
          If you&apos;re a recruiter who stumbled here: hi, I&apos;m available: {' '}
          <a
            href="mailto:rejectlytics@gmail.com"
            className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 underline underline-offset-2 decoration-zinc-700 hover:decoration-zinc-500"
          >
            rejectlytics@gmail.com
          </a>
          {' '} (please don&apos;t contribute to the dataset)
        </p>
        <p className="text-xs text-zinc-400 font-mono mt-2">
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
    </ScrollReveal>
  );
}
