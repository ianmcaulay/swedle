import { getStreak } from '../../utils/storage';
import Confetti from '../Confetti';
import CatReward from '../CatReward';

function getMessage(cluesUsed, totalClues) {
  if (cluesUsed === 1) return 'Nailed it on the first clue!';
  if (cluesUsed <= Math.ceil(totalClues / 2)) return 'Nice — got there quickly.';
  if (cluesUsed < totalClues) return 'Got there in the end!';
  return 'Needed every clue — worth a second look.';
}

export default function CluesResults({ term, explanation, cluesUsed, totalClues }) {
  const streak = getStreak();
  const perfect = cluesUsed === 1;

  return (
    <div className="px-4 max-w-lg mx-auto text-center animate-fade-in">
      {perfect && <Confetti />}
      <div className="mb-6">
        <p className="text-xs text-brand-300/50 uppercase tracking-wider mb-2">
          The answer was
        </p>
        <div className="text-3xl font-bold text-brand-300 mb-2">{term}</div>
        <p className="text-brand-200/70 text-lg">
          {cluesUsed} of {totalClues} clues used
        </p>
        <p className="text-brand-200/50 text-sm mt-1">{getMessage(cluesUsed, totalClues)}</p>
      </div>

      <CatReward />

      <div className="flex justify-center gap-8 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-400">{streak.current}</div>
          <div className="text-xs text-brand-200/50 uppercase tracking-wider">
            Day streak
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-400">{streak.best}</div>
          <div className="text-xs text-brand-200/50 uppercase tracking-wider">
            Best streak
          </div>
        </div>
      </div>

      <div className="text-left p-4 rounded-xl border border-brand-300/10 bg-brand-200/5">
        <h3 className="text-sm font-semibold text-brand-300/60 uppercase tracking-wider mb-2">
          Why
        </h3>
        <p className="text-sm text-brand-100/80 leading-relaxed italic">{explanation}</p>
      </div>

      <p className="text-sm text-brand-200/40 mt-8 mb-4">
        Come back tomorrow for a new concept!
      </p>
    </div>
  );
}
