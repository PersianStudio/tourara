/**
 * Lightweight debounce used by tour update listeners to coalesce resize/scroll bursts.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends any[]>(f: (...args: T) => void, interval = 300) {
  let timeoutId: number;
  return (...args: T) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => f(...args), interval);
  };
}
