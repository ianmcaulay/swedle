import { useState } from 'react';

const LINES = [
  "There are only 10 types of people: those who understand binary and those who don't.",
  'A SQL query walks into a bar, walks up to two tables, and asks: "Can I join you?"',
  'Why do programmers prefer dark mode? Light attracts bugs.',
  "It's not a bug — it's an undocumented feature.",
  '99 little bugs in the code, 99 little bugs. Take one down, patch it around — 127 little bugs in the code.',
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "There are two hard problems in computer science: cache invalidation, naming things, and off-by-one errors.",
  'To understand recursion, you must first understand recursion.',
  'A programmer was told to "go to hell." Turns out the worst part was the Y2K compliance work.',
  'Real programmers count from 0.',
  '8 bytes walk into a bar. The bartender asks what they want. One says: "Make us a double."',
  'A programmer\'s wife says: "Go get a loaf of bread, and if they have eggs, get a dozen." He comes home with 12 loaves of bread.',
  'Why do Java developers wear glasses? Because they don\'t see sharp (C#).',
  "!false — it's funny because it's true.",
  'A programmer is someone who solves a problem you didn\'t know you had, in a way you don\'t understand.',
  'Two threads walk into a bar. The other thread orders a beer before the bartender even takes the order.',
];

export default function Reward() {
  const [line] = useState(() => LINES[Math.floor(Math.random() * LINES.length)]);

  return (
    <div className="my-6 animate-fade-in">
      <div className="rounded-xl border border-brand-300/15 bg-brand-200/5 p-4 text-left font-mono">
        <p className="text-[10px] text-accent-400/70 uppercase tracking-wider mb-2">
          // bonus round
        </p>
        <p className="text-sm text-brand-100/80 leading-relaxed">{line}</p>
      </div>
    </div>
  );
}
