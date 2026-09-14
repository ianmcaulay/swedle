export default function TFTimer({ timeRemaining, totalTime }) {
  const pct = (timeRemaining / totalTime) * 100;
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full max-w-lg mx-auto px-4 mb-4">
      <div className="h-2 bg-brand-200/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-linear`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-brand-200/50 text-right mt-1 font-mono">
        {timeRemaining}s
      </p>
    </div>
  );
}
