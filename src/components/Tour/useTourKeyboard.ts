import type * as React from 'react';
import type { TourDirection } from '../../types';
import type { TourLogic } from '../../types';

export interface UseTourKeyboardArgs {
  tourLogic: TourLogic;
  direction: TourDirection;
  disableClose?: boolean;
  disableNext?: boolean;
  disablePrev?: boolean;
}

/**
 * Escape / arrow-key handler. In RTL, left/right are swapped so arrows
 * follow reading order (right = previous, left = next).
 */
export function useTourKeyboard({
  tourLogic,
  direction,
  disableClose,
  disableNext,
  disablePrev,
}: UseTourKeyboardArgs): (event: React.KeyboardEvent) => void {
  return (event: React.KeyboardEvent) => {
    const goNext = () => {
      if (!disableNext) tourLogic.next();
    };
    const goPrev = () => {
      if (!disablePrev) tourLogic.prev();
    };

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        if (!disableClose) {
          tourLogic.close();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        // RTL: right arrow steps backward (reading order)
        direction === 'rtl' ? goPrev() : goNext();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        direction === 'rtl' ? goNext() : goPrev();
        break;
    }
  };
}
