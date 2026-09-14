/**
 * Debug mode: add ?debug=1&date=2026-09-14 to the URL to override the date.
 * Returns the effective date (overridden or real).
 */
export function getEffectiveDate() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === '1' && params.get('date')) {
    const parsed = new Date(params.get('date') + 'T00:00:00');
    if (!isNaN(parsed)) return parsed;
  }
  return new Date();
}

export function isDebugMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('debug') === '1';
}

/**
 * Navigate to a different debug date.
 */
export function navigateToDate(date) {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const url = new URL(window.location);
  url.searchParams.set('debug', '1');
  url.searchParams.set('date', dateStr);
  window.location.href = url.toString();
}
