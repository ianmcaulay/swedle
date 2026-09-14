import ConnectionsTile from './ConnectionsTile';

export default function ConnectionsGrid({ expressions, selectedTiles, onToggle, disabled, shaking }) {
  return (
    <div className={`grid grid-cols-4 gap-2 ${shaking ? 'animate-shake' : ''}`}>
      {expressions.map((expr) => (
        <ConnectionsTile
          key={expr}
          expression={expr}
          selected={selectedTiles.includes(expr)}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
