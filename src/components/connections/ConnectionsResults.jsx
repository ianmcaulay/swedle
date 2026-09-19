import { getStreak } from '../../utils/storage';
import ConnectionsSolvedGroup from './ConnectionsSolvedGroup';
import Confetti from '../Confetti';
import Reward from '../Reward';

function getMessage(mistakes, won) {
  if (!won) return 'Better luck next time! Study the groups below.';
  if (mistakes === 0) return 'Flawless! No mistakes!';
  if (mistakes === 1) return 'So close to perfect!';
  if (mistakes === 2) return 'Nice work!';
  return 'You got there in the end!';
}

export default function ConnectionsResults({ groups, solvedGroups, mistakes, won }) {
  const streak = getStreak();
  const perfect = won && mistakes === 0;

  // Show groups in difficulty order
  const sortedGroups = [...groups].sort((a, b) => a.difficulty - b.difficulty);

  return (
    <div className="px-4 max-w-lg mx-auto text-center animate-fade-in">
      {perfect && <Confetti />}
      <div className="mb-6">
        <div className="text-4xl font-bold text-brand-300 mb-2">
          {won ? 'Solved!' : 'Game Over'}
        </div>
        <p className="text-brand-200/70 text-lg">{getMessage(mistakes, won)}</p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < mistakes ? 'bg-incorrect' : 'bg-brand-200/15'
            }`}
          />
        ))}
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

      <div className="space-y-2 mb-8">
        {sortedGroups.map((group) => (
          <ConnectionsSolvedGroup key={group.value} group={group} />
        ))}
      </div>

      <p className="text-sm text-brand-200/40 mt-4 mb-4">
        Come back tomorrow for a new challenge!
      </p>
    </div>
  );
}
