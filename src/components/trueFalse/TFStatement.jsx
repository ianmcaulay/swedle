import { useState } from 'react';

export default function TFStatement({ statement, onAnswer, questionNumber, total }) {
  const [flash, setFlash] = useState(null); // 'correct' | 'incorrect' | null

  function handleAnswer(answer) {
    if (flash !== null) return;
    const correct = answer === statement.answer;
    setFlash(correct ? 'correct' : 'incorrect');
    setTimeout(() => {
      onAnswer(answer, correct);
    }, 400);
  }

  return (
    <div className="px-4 max-w-lg mx-auto">
      <p className="text-xs text-brand-300/50 font-medium mb-2 uppercase tracking-wider">
        Statement {questionNumber} of {total}
      </p>
      <div
        className={`rounded-xl border-2 p-6 mb-8 transition-colors duration-300 ${
          flash === 'correct'
            ? 'border-correct bg-correct-bg'
            : flash === 'incorrect'
            ? 'border-incorrect bg-incorrect-bg'
            : 'border-brand-300/20 bg-brand-200/5'
        }`}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-brand-50 leading-relaxed text-center">
          {statement.statement}
        </h2>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleAnswer(true)}
          disabled={flash !== null}
          className="flex-1 max-w-[140px] py-4 rounded-xl border-2 border-correct/30 bg-correct-bg/50 text-correct font-bold text-lg transition-all cursor-pointer hover:border-correct/60 hover:bg-correct-bg active:scale-95 disabled:opacity-50"
        >
          True
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={flash !== null}
          className="flex-1 max-w-[140px] py-4 rounded-xl border-2 border-incorrect/30 bg-incorrect-bg/50 text-incorrect font-bold text-lg transition-all cursor-pointer hover:border-incorrect/60 hover:bg-incorrect-bg active:scale-95 disabled:opacity-50"
        >
          False
        </button>
      </div>
    </div>
  );
}
