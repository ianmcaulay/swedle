export default function ProgressDots({ answers, total, currentIndex }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }, (_, i) => {
        const answer = answers[i];
        let classes = 'w-2.5 h-2.5 rounded-full transition-all duration-300';

        if (answer !== undefined) {
          classes += answer.correct
            ? ' bg-correct scale-110'
            : ' bg-incorrect scale-110';
        } else if (i === currentIndex) {
          classes += ' bg-brand-400 scale-125';
        } else {
          classes += ' bg-brand-200/20';
        }

        return <div key={i} className={classes} />;
      })}
    </div>
  );
}
