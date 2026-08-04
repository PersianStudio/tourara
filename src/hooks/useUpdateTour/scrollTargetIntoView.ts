/**
 * Scrolls a tour target into view at most once per scrollKey (typically
 * stepIndex:selector) so step changes scroll while layout thrashing does not.
 */

import { isForeignTarget } from '../../utils/dom';

export interface ScrollTargetIntoViewArgs {
  el: HTMLElement;
  scrollKey: string;
  lastScrollKey: { current: string };
  disableAutoScroll?: boolean;
  disableSmoothScroll?: boolean;
  allowForeignTarget?: boolean;
  root?: Element;
  selector?: string;
}

export function scrollTargetIntoView({
  el,
  scrollKey,
  lastScrollKey,
  disableAutoScroll,
  disableSmoothScroll,
  allowForeignTarget,
  root,
  selector,
}: ScrollTargetIntoViewArgs): void {
  if (disableAutoScroll) return;
  if (allowForeignTarget && root && selector && isForeignTarget(root, selector)) return;
  if (lastScrollKey.current === scrollKey) return;
  lastScrollKey.current = scrollKey;

  el.scrollIntoView({
    behavior: disableSmoothScroll ? 'auto' : 'smooth',
    block: 'center',
    inline: 'nearest',
  });
}
