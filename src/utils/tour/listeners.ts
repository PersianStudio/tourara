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
  update: () => void;
  customSetListener?: (update: () => void) => void;
  customRemoveListener?: (update: () => void) => void;
  event?: string; // default is resize event
}

export function setTourUpdateListener(args: SetTourUpdateListenerArgs) {
  const { update, customSetListener, customRemoveListener, event } = { event: 'resize', ...args };
  if (customSetListener && customRemoveListener) {
    customSetListener(update);
    return () => customRemoveListener(update);
  }
  window.addEventListener(event, update);
  return () => window.removeEventListener(event, update);
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
