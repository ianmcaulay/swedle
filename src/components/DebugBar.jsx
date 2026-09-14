import { navigateToDate } from '../utils/debugDate';
import { getDayNumber, getDateKey, getFormatLabel } from '../utils/dailyQuiz';

export default function DebugBar({ date, format }) {
  const dayNumber = getDayNumber(date);
  const dateKey = getDateKey(date);

  function shiftDay(offset) {
    const next = new Date(date);
    next.setDate(next.getDate() + offset);
    navigateToDate(next);
  }

  return (
    <div className="bg-yellow-900/80 text-yellow-200 text-xs px-4 py-2 flex items-center justify-between gap-4 font-mono">
      <span>DEBUG</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => shiftDay(-1)}
          className="px-2 py-0.5 bg-yellow-800 rounded hover:bg-yellow-700 cursor-pointer"
        >
          &larr; Prev
        </button>
        <span>{dateKey} (day {dayNumber}) [{getFormatLabel(format)}]</span>
        <button
          onClick={() => shiftDay(1)}
          className="px-2 py-0.5 bg-yellow-800 rounded hover:bg-yellow-700 cursor-pointer"
        >
          Next &rarr;
        </button>
      </div>
      <span />
    </div>
  );
}
