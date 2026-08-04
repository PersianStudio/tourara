/**
 * Keyboard focus trap spanning the tooltip and (optionally) the highlighted target.
 * Keeps tab order inside the tour UI while the overlay is open.
 */

//@ts-nocheck

import { TAB_KEYCODE } from '../constants';
import { getEdgeFocusables } from '../dom';

interface FocusTrapArgs {
  start: HTMLElement;
  end: HTMLElement;
  beforeStart?: HTMLElement;
  afterEnd?: HTMLElement;
  // element that should be excluded from the focus trap but may obtain focus.
  // any focus changes from this element will be directed back to the trap.
  // behavior is based on "verify address" example from https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html
  lightningRod?: HTMLElement;
}

// helper function to create a keyboard focus trap, potentially including multiple elements
function getFocusTrapHandler(args: FocusTrapArgs): (e: KeyboardEvent) => void {
  const { start, end, beforeStart, afterEnd, lightningRod } = args;
  return (e: KeyboardEvent) => {
    if (e.keyCode === TAB_KEYCODE) {
      if (e.shiftKey && e.target === start) {
        e.preventDefault();
        beforeStart ? beforeStart.focus() : end.focus();
      } else if (!e.shiftKey && e.target === end) {
        e.preventDefault();
        afterEnd ? afterEnd.focus() : start.focus();
      } else if (e.target === lightningRod) {
        e.preventDefault();
        start.focus();
      }
    }
  };
}

export const setFocusTrap = (
  tooltipContainer: HTMLElement,
  target?: HTMLElement,
  disableMaskInteraction?: boolean,
): (() => void) => {
  if (!tooltipContainer) {
    return;
  }

  const { start: tooltipFirst, end: tooltipLast } = getEdgeFocusables(tooltipContainer, tooltipContainer);
  const { start: targetFirst, end: targetLast } = getEdgeFocusables(undefined, target, true);

  let tooltipBeforeStart: HTMLElement;
  let tooltipAfterEnd: HTMLElement;
  let targetTrapHandler: (e: KeyboardEvent) => void;

  if (target && !disableMaskInteraction && targetFirst && targetLast) {
    tooltipAfterEnd = targetFirst;
    tooltipBeforeStart = targetLast;
    targetTrapHandler = getFocusTrapHandler({
      start: targetFirst,
      end: targetLast,
      beforeStart: tooltipLast,
      afterEnd: tooltipFirst,
    });
    target.addEventListener('keydown', targetTrapHandler);
  }

  const tooltipTrapHandler = getFocusTrapHandler({
    start: tooltipFirst,
    end: tooltipLast,
    beforeStart: tooltipBeforeStart,
    afterEnd: tooltipAfterEnd,
    lightningRod: tooltipContainer,
  });
  tooltipContainer.addEventListener('keydown', tooltipTrapHandler);

  return () => {
    if (target) {
      target.removeEventListener('keydown', targetTrapHandler);
    }

    tooltipContainer.removeEventListener('keydown', tooltipTrapHandler);
  };
};
