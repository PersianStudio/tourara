/**
 * Injects default tour chrome CSS once (no MUI, no consumer stylesheet required).
 * Consumers can still override via CSS variables (`--tourara-accent`, etc.).
 */
import cssText from './tourara.css?inline';

let injected = false;

export function injectTouraraStyles(): void {
  if (injected || typeof document === 'undefined') return;
  injected = true;

  if (document.querySelector('style[data-tourara-styles]')) return;

  const style = document.createElement('style');
  style.setAttribute('data-tourara-styles', '');
  style.textContent = cssText;
  document.head.appendChild(style);
}
