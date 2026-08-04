/**
 * Scroll locking for active tours: blocks user scroll while allowing programmatic scroll.
 */

/**
 * Blocks user-driven scrolling while allowing programmatic scrollIntoView / scrollTo.
 * Uses event prevention instead of overflow:hidden (which breaks scrollIntoView).
 * Touch/wheel inside the tooltip shell remain allowed so long step bodies can scroll on mobile.
 */
export function lockUserScroll(): () => void {
  const isInsideTooltip = (event: Event) => {
    const target = event.target as HTMLElement | null;
    return Boolean(
      target?.closest?.(
        '.tourara-tooltip-shell, .tourara-tooltip, [id^="tour-tooltip-container"], [id*="tour-tooltip"]',
      ),
    );
  };

  const blockWheelTouch = (event: Event) => {
    if (isInsideTooltip(event)) return;
    event.preventDefault();
  };

  const blockKeys = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    // Allow typing / arrows inside the tour tooltip for a11y navigation.
    if (target?.closest?.('[id^="tour-tooltip-container"], [id*="tour-tooltip"], .tourara-tooltip-shell')) {
      return;
    }

    const scrollKeys = new Set([
      ' ',
      'Spacebar',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      'ArrowUp',
      'ArrowDown',
    ]);

    if (scrollKeys.has(event.key)) {
      event.preventDefault();
    }
  };

  const opts: AddEventListenerOptions = { passive: false, capture: true };
  window.addEventListener('wheel', blockWheelTouch, opts);
  window.addEventListener('touchmove', blockWheelTouch, opts);
  window.addEventListener('keydown', blockKeys, opts);

  const html = document.documentElement;
  const body = document.body;
  const prevHtmlOverscroll = html.style.overscrollBehavior;
  const prevBodyOverscroll = body.style.overscrollBehavior;
  html.style.overscrollBehavior = 'none';
  body.style.overscrollBehavior = 'none';

  return () => {
    window.removeEventListener('wheel', blockWheelTouch, opts);
    window.removeEventListener('touchmove', blockWheelTouch, opts);
    window.removeEventListener('keydown', blockKeys, opts);
    html.style.overscrollBehavior = prevHtmlOverscroll;
    body.style.overscrollBehavior = prevBodyOverscroll;
  };
}
