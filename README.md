# swedle

A daily puzzle game for software engineers, in the spirit of Wordle, Connections, and Clues by Sam. Each day brings one short game built around software engineering concepts: system design trade-offs, Big-O, latency numbers, and back-of-the-envelope estimation.

**Play it at https://swedle-beta.vercel.app/**

I play a handful of daily puzzles every morning and wanted one about the stuff I actually work with, so I built it.

## Formats

The format rotates daily:

| Format | How it plays |
|---|---|
| Multiple Choice | 5 questions on trade-offs and CS fundamentals |
| Connections | Sort 16 items into 4 groups (Big-O classes, latency tiers, failure modes, ...) |
| True or False | 10 statements against a 90-second clock |
| Estimate | Fermi-style capacity guessing with hot/cold feedback |

Progress and streaks are stored in localStorage. There's no backend or account.

## How it works

- **React + Vite + Tailwind v4**, deployed on Vercel.
- **Content is plain JSON** (`src/data/days/`), one file per week. Each day declares its `format` and its content.
- **Day selection is deterministic.** It's computed from a fixed epoch date, so every player gets the same puzzle each day, and the pool cycles once it runs out.
- **`npm run validate`** checks every content file's schema (option counts, unique group keys, one group per difficulty, and so on) before commit.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run validate   # check content files
```

Add `?debug=1&date=YYYY-MM-DD` to the URL to preview any day.
