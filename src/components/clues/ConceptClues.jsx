import { useState, useEffect, useCallback } from 'react';
import CluesResults from './CluesResults';
import { getDateKey } from '../../utils/dailyQuiz';
import { saveGameResult, saveGameProgress, getQuizProgress, getQuizResult } from '../../utils/storage';

export default function ConceptClues({ day, date }) {
  const dateKey = getDateKey(date);
  const { term, clues, options, correctIndex, explanation } = day;

  const [revealedCount, setRevealedCount] = useState(1);
  const [wrongIndices, setWrongIndices] = useState([]);
  const [finished, setFinished] = useState(false);
  const [cluesUsed, setCluesUsed] = useState(null);

  // Restore state on mount
  useEffect(() => {
    const result = getQuizResult(dateKey);
    if (result && result.format === 'clues') {
      setRevealedCount(result.cluesUsed || clues.length);
      setWrongIndices(result.wrongIndices || []);
      setCluesUsed(result.cluesUsed || clues.length);
      setFinished(true);
      return;
    }

    const progress = getQuizProgress(dateKey);
    if (progress && progress.format === 'clues') {
      setRevealedCount(progress.revealedCount || 1);
      setWrongIndices(progress.wrongIndices || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const handleGuess = useCallback(
    (index) => {
      if (finished || wrongIndices.includes(index)) return;

      if (index === correctIndex) {
        setFinished(true);
        setCluesUsed(revealedCount);
        saveGameResult(dateKey, {
          format: 'clues',
          cluesUsed: revealedCount,
          wrongIndices,
          totalClues: clues.length,
        });
        return;
      }

      const newWrong = [...wrongIndices, index];
      setWrongIndices(newWrong);
      const nextRevealed = Math.min(revealedCount + 1, clues.length);
      setRevealedCount(nextRevealed);
      saveGameProgress(dateKey, {
        format: 'clues',
        revealedCount: nextRevealed,
        wrongIndices: newWrong,
      });
    },
    [finished, wrongIndices, correctIndex, revealedCount, dateKey, clues.length]
  );

  if (finished) {
    return (
      <CluesResults
        term={term}
        explanation={explanation}
        cluesUsed={cluesUsed}
        totalClues={clues.length}
      />
    );
  }

  return (
    <div className="px-4 max-w-lg mx-auto">
      <p className="text-xs text-brand-300/50 text-center font-medium mb-4 uppercase tracking-wider">
        Guess the concept — fewer clues, higher score
      </p>

      <div className="space-y-2 mb-6">
        {clues.slice(0, revealedCount).map((clue, i) => (
          <div
            key={i}
            className="rounded-xl border-2 border-brand-300/20 bg-brand-200/5 p-4 animate-slide-in"
          >
            <span className="text-xs text-accent-400 font-semibold mr-2">
              Clue {i + 1}
            </span>
            <span className="text-brand-50 text-sm sm:text-base leading-relaxed">
              {clue}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option, i) => {
          const isWrong = wrongIndices.includes(i);
          const classes = isWrong
            ? 'w-full text-left px-5 py-4 rounded-xl border-2 border-incorrect/30 bg-incorrect-bg/40 text-brand-200/40 line-through cursor-default'
            : 'w-full text-left px-5 py-4 rounded-xl border-2 border-brand-300/20 bg-brand-200/5 text-brand-100 hover:border-brand-400/50 hover:bg-brand-200/10 active:scale-[0.98] cursor-pointer transition-all duration-200';
          return (
            <button
              key={i}
              onClick={() => handleGuess(i)}
              disabled={isWrong}
              className={classes}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
