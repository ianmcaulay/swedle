import { useState, useEffect, useCallback } from 'react';
import EstimateResults from './EstimateResults';
import { getDateKey } from '../../utils/dailyQuiz';
import { saveGameResult, saveGameProgress, getQuizProgress, getQuizResult } from '../../utils/storage';

const MAX_ATTEMPTS = 5;
const WIN_RATIO = 3; // within a factor of 3x counts as "solved" for a Fermi estimate

function feedbackFor(guess, trueValue) {
  const ratio = Math.max(guess / trueValue, trueValue / guess);
  const direction = guess < trueValue ? 'low' : guess > trueValue ? 'high' : 'exact';
  let label;
  if (ratio <= 1.15) label = 'Spot on!';
  else if (ratio <= WIN_RATIO) label = `Close enough — too ${direction}, but within range`;
  else if (ratio <= 10) label = `Too ${direction} — roughly one order of magnitude off`;
  else label = `Too ${direction} — off by about ${Math.round(Math.log10(ratio))} orders of magnitude`;
  return { ratio, direction, label, won: ratio <= WIN_RATIO };
}

export default function EstimationGame({ day, date }) {
  const dateKey = getDateKey(date);
  const { prompt, trueValue, unit, explanation } = day;

  const [guesses, setGuesses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const result = getQuizResult(dateKey);
    if (result && result.format === 'estimate') {
      setGuesses(result.guesses || []);
      setFinished(true);
      setWon(result.won || false);
      return;
    }

    const progress = getQuizProgress(dateKey);
    if (progress && progress.format === 'estimate') {
      setGuesses(progress.guesses || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const parsed = parseFloat(inputValue);
      if (isNaN(parsed) || parsed <= 0 || finished) return;

      const fb = feedbackFor(parsed, trueValue);
      const newGuesses = [...guesses, { value: parsed, ...fb }];
      setGuesses(newGuesses);
      setInputValue('');

      const attemptsLeft = MAX_ATTEMPTS - newGuesses.length;
      if (fb.won) {
        setFinished(true);
        setWon(true);
        saveGameResult(dateKey, { format: 'estimate', guesses: newGuesses, won: true });
      } else if (attemptsLeft <= 0) {
        setFinished(true);
        setWon(false);
        saveGameResult(dateKey, { format: 'estimate', guesses: newGuesses, won: false });
      } else {
        saveGameProgress(dateKey, { format: 'estimate', guesses: newGuesses });
      }
    },
    [inputValue, finished, trueValue, guesses, dateKey]
  );

  if (finished) {
    return (
      <EstimateResults
        prompt={prompt}
        trueValue={trueValue}
        unit={unit}
        explanation={explanation}
        guesses={guesses}
        won={won}
      />
    );
  }

  const attemptsUsed = guesses.length;

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="flex justify-center gap-3 mb-4">
        {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < attemptsUsed ? 'bg-incorrect' : 'bg-brand-200/20'
            }`}
          />
        ))}
      </div>

      <div className="rounded-xl border-2 border-brand-300/20 bg-brand-200/5 p-5 mb-5">
        <p className="text-brand-50 text-sm sm:text-base leading-relaxed">{prompt}</p>
      </div>

      {guesses.length > 0 && (
        <div className="space-y-2 mb-5">
          {guesses.map((g, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-brand-300/10 bg-brand-200/5 px-4 py-2 animate-slide-in"
            >
              <span className="font-mono text-brand-200 text-sm">
                {g.value.toLocaleString()} {unit}
              </span>
              <span className={`text-xs font-semibold ${g.won ? 'text-correct' : 'text-brand-200/60'}`}>
                {g.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Your guess (${unit})`}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-brand-300/20 bg-brand-200/5 text-brand-50 placeholder:text-brand-200/30 focus:outline-none focus:border-brand-400/60"
        />
        <button
          type="submit"
          disabled={!inputValue}
          className="px-5 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-colors cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-default"
        >
          Guess
        </button>
      </form>
      <p className="text-xs text-brand-200/40 mt-3 text-center">
        {MAX_ATTEMPTS - attemptsUsed} attempt{MAX_ATTEMPTS - attemptsUsed === 1 ? '' : 's'} left · within 3x counts as solved
      </p>
    </div>
  );
}
