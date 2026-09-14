import { getStreak } from '../utils/storage';
import Confetti from './Confetti';
import CatReward from './CatReward';

function getMessage(score, total) {
  const pct = score / total;
  if (pct === 1) return "Perfect score! You're crushing it!";
  if (pct >= 0.8) return 'Great job! Almost perfect!';
  if (pct >= 0.6) return 'Nice work! Keep practicing!';
  if (pct >= 0.4) return 'Good effort! Review the explanations.';
  return "Keep going! Every question is a learning opportunity.";
}

export default function Results({ answers, questions, score, total }) {
  const streak = getStreak();
  const perfect = score === total;

  return (
    <div className="px-4 max-w-lg mx-auto text-center animate-fade-in">
      {perfect && <Confetti />}
      <div className="mb-8">
        <div className="text-6xl font-bold text-brand-300 mb-2">
          {score}/{total}
        </div>
        <p className="text-brand-200/70 text-lg">{getMessage(score, total)}</p>
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

      <div className="text-left space-y-3">
        <h3 className="text-sm font-semibold text-brand-300/60 uppercase tracking-wider mb-3">
          Review
        </h3>
        {questions.map((q, i) => {
          const answer = answers[i];
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                answer.correct
                  ? 'border-correct/20 bg-correct-bg/30'
                  : 'border-incorrect/20 bg-incorrect-bg/30'
              }`}
            >
              <p className="text-sm text-brand-100 mb-1">{q.question}</p>
              {!answer.correct && (
                <p className="text-xs text-brand-200/50">
                  <span className="text-incorrect">Your answer:</span>{' '}
                  {q.options[answer.selectedIndex]}
                  {' • '}
                  <span className="text-correct">Correct:</span>{' '}
                  {q.options[q.correctIndex]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-brand-200/40 mt-8 mb-4">
        Come back tomorrow for a new quiz!
      </p>
    </div>
  );
}
