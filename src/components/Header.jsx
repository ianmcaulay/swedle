import { getDisplayDate, getFormatLabel } from '../utils/dailyQuiz';

export default function Header({ date, format }) {
  return (
    <header className="text-center pt-8 pb-4 px-4">
      <h1 className="text-3xl font-bold text-brand-300 tracking-tight">
        swedle
      </h1>
      <p className="text-sm text-brand-200/60 mt-1">{getDisplayDate(date)}</p>
      <p className="text-xs text-accent-400/80 font-medium mt-1 uppercase tracking-wider">
        {getFormatLabel(format)}
      </p>
    </header>
  );
}
