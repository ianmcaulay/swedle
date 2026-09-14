import { useState, useEffect, useMemo, useCallback } from 'react';
import ConnectionsGrid from './ConnectionsGrid';
import ConnectionsSolvedGroup from './ConnectionsSolvedGroup';
import ConnectionsResults from './ConnectionsResults';
import { getDateKey, getDayNumber, seededShuffle } from '../../utils/dailyQuiz';
import { saveGameResult, saveGameProgress, getQuizProgress, getQuizResult } from '../../utils/storage';

const MAX_MISTAKES = 4;

export default function ConnectionsGame({ puzzle, date }) {
  const dateKey = getDateKey(date);

  // Build expression → group index lookup
  const expressionGroupMap = useMemo(() => {
    const map = {};
    puzzle.groups.forEach((group, idx) => {
      group.expressions.forEach((expr) => {
        map[expr] = idx;
      });
    });
    return map;
  }, [puzzle]);

  // Deterministically shuffle all 16 tiles
  const allExpressions = useMemo(() => {
    const exprs = puzzle.groups.flatMap((g) => g.expressions);
    return seededShuffle(exprs, getDayNumber(date) + 100);
  }, [puzzle, date]);

  const [selectedTiles, setSelectedTiles] = useState([]);
  const [solvedGroupIndices, setSolvedGroupIndices] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [message, setMessage] = useState(null);

  // Restore state on mount
  useEffect(() => {
    const result = getQuizResult(dateKey);
    if (result && result.format === 'connections') {
      setSolvedGroupIndices(result.solvedGroups || []);
      setMistakes(result.mistakes || 0);
      setFinished(true);
      setWon(result.won || false);
      return;
    }

    const progress = getQuizProgress(dateKey);
    if (progress && progress.format === 'connections') {
      setSolvedGroupIndices(progress.solvedGroups || []);
      setMistakes(progress.mistakes || 0);
      setSelectedTiles(progress.selectedTiles || []);
    }
  }, [dateKey]);

  // Remaining (unsolved) tiles
  const remainingExpressions = useMemo(() => {
    const solvedExprs = new Set(
      solvedGroupIndices.flatMap((idx) => puzzle.groups[idx].expressions)
    );
    return allExpressions.filter((e) => !solvedExprs.has(e));
  }, [allExpressions, solvedGroupIndices, puzzle]);

  const handleToggle = useCallback(
    (expr) => {
      if (finished) return;
      setMessage(null);
      setSelectedTiles((prev) => {
        if (prev.includes(expr)) {
          return prev.filter((e) => e !== expr);
        }
        if (prev.length >= 4) return prev;
        return [...prev, expr];
      });
    },
    [finished]
  );

  function handleSubmit() {
    if (selectedTiles.length !== 4 || finished) return;
    setMessage(null);

    // Check if all 4 belong to the same group
    const groupIndices = selectedTiles.map((e) => expressionGroupMap[e]);
    const allSame = groupIndices.every((g) => g === groupIndices[0]);

    if (allSame) {
      // Correct!
      const newSolved = [...solvedGroupIndices, groupIndices[0]];
      setSolvedGroupIndices(newSolved);
      setSelectedTiles([]);

      if (newSolved.length === 4) {
        // Won!
        setFinished(true);
        setWon(true);
        saveGameResult(dateKey, {
          format: 'connections',
          solvedGroups: newSolved,
          mistakes,
          won: true,
        });
      } else {
        saveGameProgress(dateKey, {
          format: 'connections',
          solvedGroups: newSolved,
          mistakes,
          selectedTiles: [],
        });
      }
    } else {
      // Wrong — check for "one away"
      const counts = {};
      groupIndices.forEach((g) => {
        counts[g] = (counts[g] || 0) + 1;
      });
      const isOneAway = Object.values(counts).some((c) => c === 3);

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setShaking(true);
      setMessage(isOneAway ? 'One away!' : null);
      setTimeout(() => setShaking(false), 400);

      if (newMistakes >= MAX_MISTAKES) {
        // Game over
        setFinished(true);
        setWon(false);
        setSelectedTiles([]);
        // Reveal all remaining groups
        const allIndices = [0, 1, 2, 3];
        setSolvedGroupIndices(allIndices);
        saveGameResult(dateKey, {
          format: 'connections',
          solvedGroups: solvedGroupIndices,
          mistakes: newMistakes,
          won: false,
        });
      } else {
        setSelectedTiles([]);
        saveGameProgress(dateKey, {
          format: 'connections',
          solvedGroups: solvedGroupIndices,
          mistakes: newMistakes,
          selectedTiles: [],
        });
      }
    }
  }

  function handleDeselectAll() {
    setSelectedTiles([]);
    setMessage(null);
  }

  if (finished) {
    return (
      <ConnectionsResults
        groups={puzzle.groups}
        solvedGroups={solvedGroupIndices}
        mistakes={mistakes}
        won={won}
      />
    );
  }

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="flex justify-center gap-3 mb-4">
        {Array.from({ length: MAX_MISTAKES }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < mistakes ? 'bg-incorrect' : 'bg-brand-200/20'
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-brand-300/50 text-center font-medium mb-3 uppercase tracking-wider">
        Find groups of 4 that share something in common
      </p>

      {/* Solved groups */}
      <div className="space-y-2 mb-3">
        {solvedGroupIndices.map((idx) => (
          <ConnectionsSolvedGroup key={idx} group={puzzle.groups[idx]} />
        ))}
      </div>

      {/* Grid */}
      <ConnectionsGrid
        expressions={remainingExpressions}
        selectedTiles={selectedTiles}
        onToggle={handleToggle}
        disabled={finished}
        shaking={shaking}
      />

      {/* Message */}
      {message && (
        <p className="text-center text-sm font-semibold text-yellow-400 mt-3 animate-fade-in">
          {message}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={handleDeselectAll}
          disabled={selectedTiles.length === 0}
          className="px-5 py-2.5 border-2 border-brand-300/20 text-brand-200/60 rounded-xl font-medium transition-colors cursor-pointer hover:border-brand-300/40 disabled:opacity-30 disabled:cursor-default"
        >
          Deselect All
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedTiles.length !== 4}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-colors cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-default"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
