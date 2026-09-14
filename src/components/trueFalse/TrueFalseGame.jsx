import { useState, useEffect, useRef, useCallback } from 'react';
import TFStatement from './TFStatement';
import TFTimer from './TFTimer';
import TFResults from './TFResults';
import ProgressDots from '../ProgressDots';
import { getDateKey } from '../../utils/dailyQuiz';
import { saveGameResult, saveGameProgress, getQuizProgress, getQuizResult } from '../../utils/storage';

const TOTAL_TIME = 90;

export default function TrueFalseGame({ statements, date }) {
  const dateKey = getDateKey(date);
  const total = statements.length;

  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef(null);

  // Restore state on mount
  useEffect(() => {
    const result = getQuizResult(dateKey);
    if (result && result.format === 'tf') {
      setAnswers(result.answers);
      setCurrentIndex(total);
      setFinished(true);
      setTimedOut(result.timedOut || false);
      setTimeRemaining(result.timeRemaining || 0);
      return;
    }

    const progress = getQuizProgress(dateKey);
    if (progress && progress.format === 'tf') {
      setAnswers(progress.answers);
      setCurrentIndex(progress.currentIndex);
      setTimeRemaining(progress.timeRemaining || TOTAL_TIME);
      setGameStarted(progress.gameStarted || false);
    }
  }, [dateKey, total]);

  // Timer
  useEffect(() => {
    if (!gameStarted || finished) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameStarted, finished]);

  // Handle timer expiry
  useEffect(() => {
    if (gameStarted && !finished && timeRemaining === 0) {
      finishGame(answers, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, gameStarted, finished]);

  function finishGame(finalAnswers, didTimeOut) {
    clearInterval(timerRef.current);
    const score = finalAnswers.filter((a) => a.correct).length;
    setFinished(true);
    setTimedOut(didTimeOut);
    saveGameResult(dateKey, {
      format: 'tf',
      answers: finalAnswers,
      score,
      timeRemaining: didTimeOut ? 0 : timeRemaining,
      timedOut: didTimeOut,
    });
  }

  const handleAnswer = useCallback(
    (selectedAnswer, correct) => {
      const newAnswers = [
        ...answers,
        { selectedAnswer, correct },
      ];
      setAnswers(newAnswers);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= total) {
        finishGame(newAnswers, false);
      } else {
        setCurrentIndex(nextIndex);
        saveGameProgress(dateKey, {
          format: 'tf',
          answers: newAnswers,
          currentIndex: nextIndex,
          timeRemaining,
          gameStarted: true,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answers, currentIndex, dateKey, total, timeRemaining]
  );

  function handleStart() {
    setGameStarted(true);
    saveGameProgress(dateKey, {
      format: 'tf',
      answers: [],
      currentIndex: 0,
      timeRemaining: TOTAL_TIME,
      gameStarted: true,
    });
  }

  const score = answers.filter((a) => a.correct).length;

  if (finished) {
    return (
      <>
        <ProgressDots answers={answers} total={total} currentIndex={total} />
        <TFResults
          answers={answers}
          statements={statements}
          score={score}
          total={total}
          timeRemaining={timeRemaining}
          timedOut={timedOut}
        />
      </>
    );
  }

  if (!gameStarted) {
    return (
      <div className="px-4 max-w-lg mx-auto text-center mt-8 animate-fade-in">
        <div className="text-6xl mb-4">&#9201;</div>
        <h2 className="text-2xl font-bold text-brand-200 mb-3">Speed Round</h2>
        <p className="text-brand-200/60 mb-2">
          {total} statements. {TOTAL_TIME} seconds.
        </p>
        <p className="text-brand-200/40 text-sm mb-8">
          Tap True or False as fast as you can!
        </p>
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white text-lg font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
        >
          Start!
        </button>
      </div>
    );
  }

  return (
    <>
      <TFTimer timeRemaining={timeRemaining} totalTime={TOTAL_TIME} />
      <ProgressDots answers={answers} total={total} currentIndex={currentIndex} />
      <TFStatement
        key={currentIndex}
        statement={statements[currentIndex]}
        questionNumber={currentIndex + 1}
        total={total}
        onAnswer={handleAnswer}
      />
    </>
  );
}
