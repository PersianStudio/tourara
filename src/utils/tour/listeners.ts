/**
 * Event / interval helpers that re-run tour updates when the layout or target moves,
 * plus optional click-to-advance wiring on the highlighted target.
 */

//@ts-nocheck

export function setTargetWatcher(callback: () => void, interval: number): () => void {
  const intervalId: number = window.setInterval(callback, interval);

  return () => window.clearInterval(intervalId);
}

export interface SetTourUpdateListenerArgs {
  update: (event?: Event) => void;
  customSetListener?: (update: () => void) => void;
  customRemoveListener?: (update: () => void) => void;
  /** @deprecated Prefer `events`. Kept for callers that pass a single event name. */
  event?: string;
  /** Window events that should re-run geometry. Defaults to resize + scroll. */
  events?: string[];
}

/**
 * Bind layout listeners so the mask/tooltip track viewport changes.
 * Scroll is required: smooth scrollIntoView moves targets in viewport space
 * while the portal stays fixed — without this the tooltip vanishes off-screen
 * and only the overlay remains.
 */
export function setTourUpdateListener(args: SetTourUpdateListenerArgs) {
  const {
    update,
    customSetListener,
    customRemoveListener,
    event,
    events = event ? [event] : ['resize', 'scroll'],
  } = args;

  if (customSetListener && customRemoveListener) {
    customSetListener(update);
    return () => customRemoveListener(update);
  }

  const opts: AddEventListenerOptions = { capture: true, passive: true };
  for (const name of events) {
    window.addEventListener(name, update, opts);
  }
  return () => {
    for (const name of events) {
      window.removeEventListener(name, update, opts);
    }
  };
}

export const takeActionIfValid = async (action: () => void, actionValidator?: () => Promise<boolean>) => {
  if (actionValidator) {
    const valid: boolean = await actionValidator();
    if (valid) {
      action();
    }
  } else {
    action();
  }
};

export const setNextOnTargetClick = (
  target: HTMLElement,
  next: (fromTarget?: boolean) => void,
  validateNext?: () => Promise<boolean>,
): (() => void) => {
  if (!target) {
    return;
  }

  // if valid, call a handler which 1. calls the tetheredAction function and 2. removes itself from the target
  const clickHandler = () => {
    const actionWithCleanup = () => {
      next(true);
      target.removeEventListener('click', clickHandler);
    };

    takeActionIfValid(actionWithCleanup, validateNext);
  };

  target.addEventListener('click', clickHandler);
  return () => target.removeEventListener('click', clickHandler); // return so we can remove the event elsewhere if the action doesn't get called
};
