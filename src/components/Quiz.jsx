import { useState, useEffect, useCallback } from 'react';
import Question from './Question';
import Results from './Results';
import ProgressDots from './ProgressDots';
import { getDateKey } from '../utils/dailyQuiz';
import {
  saveQuizProgress,
  saveQuizResult,
  getQuizProgress,
  getQuizResult,
} from '../utils/storage';

export default function Quiz({ questions, date }) {
  const dateKey = getDateKey(date);
  const total = questions.length;

  // Check for completed or in-progress quiz
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Restore state on mount
  useEffect(() => {
    const result = getQuizResult(dateKey);
    if (result) {
      setAnswers(result.answers);
      setCurrentIndex(total);
      setFinished(true);
      return;
    }

    const progress = getQuizProgress(dateKey);
    if (progress) {
      setAnswers(progress.answers);
      setCurrentIndex(progress.currentIndex);
    }
  }, [dateKey, total]);

  const handleAnswer = useCallback(
    (selectedIndex, correct) => {
      const newAnswers = [
        ...answers,
        { selectedIndex, correct },
      ];
      setAnswers(newAnswers);
      setAnswered(true);

      if (currentIndex + 1 >= total) {
        // Quiz complete
        const score = newAnswers.filter((a) => a.correct).length;
        saveQuizResult(dateKey, newAnswers, score);
      } else {
        saveQuizProgress(dateKey, newAnswers, currentIndex);
      }
    },
    [answers, currentIndex, dateKey, total]
  );

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      setFinished(true);
    } else {
      setCurrentIndex(nextIndex);
      setAnswered(false);
      saveQuizProgress(dateKey, answers, nextIndex);
    }
  }, [currentIndex, total, dateKey, answers]);

  const score = answers.filter((a) => a.correct).length;

  if (finished) {
    return (
      <>
        <ProgressDots answers={answers} total={total} currentIndex={total} />
        <Results
          answers={answers}
          questions={questions}
          score={score}
          total={total}
        />
      </>
    );
  }

  return (
    <>
      <ProgressDots answers={answers} total={total} currentIndex={currentIndex} />
      <Question
        key={currentIndex}
        question={questions[currentIndex]}
        questionNumber={currentIndex + 1}
        total={total}
        onAnswer={handleAnswer}
      />
      {answered && (
        <div className="flex justify-center mt-6 mb-8 px-4 animate-fade-in">
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
          >
            {currentIndex + 1 >= total ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </>
  );
}
