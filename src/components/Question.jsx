import { useState } from 'react';

export default function Question({ question, onAnswer, questionNumber, total }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const answered = selectedIndex !== null;

  function handleSelect(index) {
    if (answered) return;
    setSelectedIndex(index);
    onAnswer(index, index === question.correctIndex);
  }

  function getOptionClasses(index) {
    const base =
      'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 cursor-pointer text-sm sm:text-base';

    if (!answered) {
      return `${base} border-brand-300/20 bg-brand-200/5 text-brand-100 hover:border-brand-400/50 hover:bg-brand-200/10 active:scale-[0.98]`;
    }

    if (index === question.correctIndex) {
      return `${base} border-correct bg-correct-bg text-green-200`;
    }

    if (index === selectedIndex && !isCorrect) {
      return `${base} border-incorrect bg-incorrect-bg text-red-200`;
    }

    return `${base} border-brand-300/10 bg-brand-200/5 text-brand-200/40`;
  }

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <div className="px-4 max-w-lg mx-auto">
      <p className="text-xs text-brand-300/50 font-medium mb-2 uppercase tracking-wider">
        Question {questionNumber} of {total}
      </p>
      <h2 className="text-lg sm:text-xl font-semibold text-brand-50 mb-6 leading-relaxed">
        {question.question}
      </h2>
      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={getOptionClasses(i)}
          >
            <span className="font-medium text-brand-300/40 mr-3">
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <div
            className={`text-sm font-semibold ${isCorrect ? 'text-correct' : 'text-incorrect'}`}
          >
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </div>

          {!showExplanation ? (
            <button
              onClick={() => setShowExplanation(true)}
              className="text-sm text-brand-300/60 hover:text-brand-300 transition-colors cursor-pointer"
            >
              Show explanation
            </button>
          ) : (
            <p className="text-sm text-brand-200/70 italic leading-relaxed">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
