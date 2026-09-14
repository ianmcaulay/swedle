const STORAGE_KEY = 'swedle';

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Save a completed game result. resultData should include a `format` field.
 */
export function saveGameResult(dateKey, resultData) {
  const store = getStore();
  store.results = store.results || {};
  store.results[dateKey] = { ...resultData, completedAt: new Date().toISOString() };
  updateStreak(store, dateKey);
  setStore(store);
}

// Backward-compatible alias for the original quiz-result API
export function saveQuizResult(dateKey, answers, score) {
  saveGameResult(dateKey, { format: 'mc', answers, score });
}

/**
 * Save in-progress game state. progressData should include a `format` field.
 */
export function saveGameProgress(dateKey, progressData) {
  const store = getStore();
  store.progress = store.progress || {};
  store.progress[dateKey] = progressData;
  setStore(store);
}

// Backward-compatible alias
export function saveQuizProgress(dateKey, answers, currentIndex) {
  saveGameProgress(dateKey, { format: 'mc', answers, currentIndex });
}

/**
 * Get in-progress game state for a given date.
 */
export function getQuizProgress(dateKey) {
  const store = getStore();
  return store.progress?.[dateKey] || null;
}

/**
 * Get a completed game result for a given date.
 */
export function getQuizResult(dateKey) {
  const store = getStore();
  return store.results?.[dateKey] || null;
}

/**
 * Get streak info.
 */
export function getStreak() {
  const store = getStore();
  return {
    current: store.currentStreak || 0,
    best: store.bestStreak || 0,
  };
}

/**
 * First-visit tracking.
 */
export function isFirstVisit() {
  const store = getStore();
  return !store.hasVisited;
}

export function markVisited() {
  const store = getStore();
  store.hasVisited = true;
  setStore(store);
}

/**
 * Recalculate streak based on consecutive completed days.
 */
function updateStreak(store, dateKey) {
  const results = store.results || {};
  let streak = 1;
  let checkDate = new Date(dateKey + 'T00:00:00');

  while (true) {
    checkDate.setDate(checkDate.getDate() - 1);
    const key = formatDateKey(checkDate);
    if (results[key]) {
      streak++;
    } else {
      break;
    }
  }

  store.currentStreak = streak;
  store.bestStreak = Math.max(store.bestStreak || 0, streak);
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
