import { markVisited } from '../utils/storage';

export default function Welcome({ onDismiss }) {
  function handleStart() {
    markVisited();
    onDismiss();
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <div className="max-w-md text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-brand-300 mb-3">
          swedle
        </h1>
        <p className="text-brand-200/70 text-lg mb-6 leading-relaxed">
          A daily puzzle for software engineers — estimation, system design,
          and CS fundamentals. A few minutes a day, no whiteboard needed.
        </p>

        <div className="text-left bg-brand-200/5 rounded-xl p-5 mb-8 border border-brand-300/10">
          <p className="text-sm text-brand-200/60 font-semibold uppercase tracking-wider mb-3">
            Something new every day
          </p>
          <div className="space-y-2 text-sm text-brand-100/80">
            <div className="flex items-center gap-3">
              <span className="text-accent-400 text-lg">?</span>
              <span><strong className="text-brand-200">Multiple Choice</strong> — trade-offs & CS fundamentals</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent-400 text-lg">↔</span>
              <span><strong className="text-brand-200">Connections</strong> — group Big-O, latency, and failure patterns</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent-400 text-lg">✓</span>
              <span><strong className="text-brand-200">True or False</strong> — 10 statements, beat the clock</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent-400 text-lg">💡</span>
              <span><strong className="text-brand-200">Clues</strong> — guess the concept in as few clues as possible</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent-400 text-lg">≈</span>
              <span><strong className="text-brand-200">Estimate</strong> — Fermi/capacity guessing with hot-cold feedback</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white text-lg font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
        >
          Let's go!
        </button>
      </div>
    </div>
  );
}
