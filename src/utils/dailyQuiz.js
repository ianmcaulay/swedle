import week001 from '../data/days/week-001.json';

// All curated days, sorted by day number
const ALL_DAYS = [...week001].sort((a, b) => a.day - b.day);
const TOTAL_DAYS = ALL_DAYS.length;

// Epoch: September 19, 2026 — day 0 (swedle's launch day)
const EPOCH = new Date(2026, 8, 19);

const FORMAT_LABELS = {
  mc: 'Multiple Choice',
  tf: 'True or False',
  connections: 'Connections',
  clues: 'Clues',
  estimate: 'Estimate',
};

/**
 * Get the day number (0-indexed) since our epoch.
 */
export function getDayNumber(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = d - EPOCH;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Simple seeded shuffle using the day number so each day gets a
 * deterministic but varied tile order.
 */
export function seededShuffle(arr, seed) {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get the curated day object for a given date.
 * Cycles through all curated days when content runs out.
 */
export function getDailyContent(date = new Date()) {
  const dayNum = getDayNumber(date);
  const index = ((dayNum % TOTAL_DAYS) + TOTAL_DAYS) % TOTAL_DAYS;
  return ALL_DAYS[index];
}

/**
 * Get today's game format based on curated content.
 */
export function getGameFormat(date = new Date()) {
  return getDailyContent(date).format;
}

/**
 * Get display label for a format.
 */
export function getFormatLabel(format) {
  return FORMAT_LABELS[format] || format;
}

/**
 * Get a formatted date string for display (e.g., "September 14, 2026").
 */
export function getDisplayDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get today's date key for localStorage (e.g., "2026-09-14").
 */
export function getDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Get the calendar date for a given day number.
 */
export function getDateForDay(dayNum) {
  const d = new Date(EPOCH);
  d.setDate(d.getDate() + dayNum);
  return d;
}

/**
 * Get total number of curated days.
 */
export function getTotalDays() {
  return TOTAL_DAYS;
}

/**
 * Get all curated day objects.
 */
export function getAllDays() {
  return ALL_DAYS;
}
