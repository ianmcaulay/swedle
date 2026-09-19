import { getStreak } from '../../utils/storage';
import Confetti from '../Confetti';
import Reward from '../Reward';

function getMessage(won, attempts) {
  if (won && attempts === 1) return 'First guess — great calibration!';
  if (won) return 'Solved it!';
  return "Didn't land it this time — see the breakdown below.";
}

export default function EstimateResults({ prompt, trueValue, unit, explanation, guesses, won }) {
  const streak = getStreak();
  const perfect = won && guesses.length === 1;

  return (
    <div className="px-4 max-w-lg mx-auto text-center animate-fade-in">
      {perfect && <Confetti />}
      <div className="mb-6">
        <div className={`text-3xl font-bold mb-2 ${won ? 'text-correct' : 'text-brand-300'}`}>
          {won ? 'Solved!' : 'So close'}
        </div>
        <p className="text-brand-200/70 text-lg">{getMessage(won, guesses.length)}</p>
        <p className="text-sm text-brand-200/40 mt-1">
          Answer: ~{trueValue.toLocaleString()} {unit}
        </p>
      </div>

      <Reward />

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

      <div className="text-left space-y-3">
        <h3 className="text-sm font-semibold text-brand-300/60 uppercase tracking-wider mb-2">
          Your guesses
        </h3>
        {guesses.map((g, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              g.won ? 'border-correct/20 bg-correct-bg/30' : 'border-brand-300/10 bg-brand-200/5'
            }`}
          >
            <span className="font-mono text-brand-100 text-sm">
              {g.value.toLocaleString()} {unit}
            </span>
            <span className="text-xs text-brand-200/60">{g.label}</span>
          </div>
        ))}
      </div>

      <div className="text-left p-4 rounded-xl border border-brand-300/10 bg-brand-200/5 mt-4">
        <h3 className="text-sm font-semibold text-brand-300/60 uppercase tracking-wider mb-2">
          The breakdown
        </h3>
        <p className="text-xs text-brand-200/50 mb-2 italic">{prompt}</p>
        <p className="text-sm text-brand-100/80 leading-relaxed">{explanation}</p>
      </div>

      <p className="text-sm text-brand-200/40 mt-8 mb-4">
        Come back tomorrow for a new estimate!
      </p>
    </div>
  );
}
