export default function ConnectionsTile({ expression, selected, onToggle, disabled }) {
  const base = 'flex items-center justify-center p-2 rounded-lg border-2 text-[11px] sm:text-sm font-semibold text-center leading-tight transition-all duration-200 cursor-pointer select-none min-h-[64px]';

  let classes;
  if (disabled) {
    classes = `${base} border-brand-300/10 bg-brand-200/5 text-brand-200/30 cursor-default`;
  } else if (selected) {
    classes = `${base} border-brand-400 bg-brand-500/20 text-brand-200 scale-95`;
  } else {
    classes = `${base} border-brand-300/20 bg-brand-200/5 text-brand-100 hover:border-brand-400/50 hover:bg-brand-200/10 active:scale-95`;
  }

  return (
    <button
      onClick={() => !disabled && onToggle(expression)}
      disabled={disabled}
      className={classes}
    >
      {expression}
    </button>
  );
}
