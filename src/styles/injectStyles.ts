/**
 * Injects default tour chrome CSS once (no MUI, no consumer stylesheet required).
 * Consumers can still override via CSS variables (`--tourara-accent`, etc.).
 * On HMR / re-import, style text is refreshed so z-index and chrome fixes apply.
 */
import cssText from './tourara.css?inline';

let injected = false;

export function injectTouraraStyles(): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector('style[data-tourara-styles]') as HTMLStyleElement | null;
  if (existing) {
    if (existing.textContent !== cssText) {
      existing.textContent = cssText;
    }
    injected = true;
    return;
  }

  if (injected) return;
  injected = true;

  const style = document.createElement('style');
  style.setAttribute('data-tourara-styles', '');
  style.textContent = cssText;
  document.head.appendChild(style);
}
