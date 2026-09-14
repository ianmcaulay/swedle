const DIFFICULTY_COLORS = {
  1: 'bg-yellow-500/90 text-yellow-950',
  2: 'bg-green-500/90 text-green-950',
  3: 'bg-blue-400/90 text-blue-950',
  4: 'bg-purple-400/90 text-purple-950',
};

export default function ConnectionsSolvedGroup({ group }) {
  const colorClass = DIFFICULTY_COLORS[group.difficulty] || DIFFICULTY_COLORS[1];

  return (
    <div className={`${colorClass} rounded-lg p-3 text-center animate-slide-in`}>
      <p className="font-bold text-sm">{group.label}</p>
      <p className="text-xs opacity-80 mt-0.5">
        {group.expressions.join(', ')}
      </p>
    </div>
  );
}
