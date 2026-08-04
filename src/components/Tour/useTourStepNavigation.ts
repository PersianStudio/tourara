import { useCallback } from 'react';
import type { TourStep } from '../../types';
import {
  findNextVisibleStepIndex,
  findPrevVisibleStepIndex,
  findSkipStepIndex,
} from './findVisibleStepIndex';

export interface UseTourStepNavigationArgs {
  steps: (TourStep & { isVisible?: boolean })[];
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  /** Optional controlled close; otherwise the store closes the tour. */
  onClose?: (reset?: boolean) => void;
  setTourProps: (props: { isOpen: boolean }) => void;
  cleanup: () => void;
  target: HTMLElement | undefined;
}

export interface TourStepNavigationHandlers {
  goToStep: (stepIndex: number) => void;
  handleNextClick: () => void;
  handlePrevClick: () => void;
  handleSkipClick: () => void;
  closeTour: (reset?: boolean) => void;
}

/**
 * Next / prev / skip / goToStep / close, including visibility checks that
 * skip steps whose selectors are not currently in the DOM.
 */
export function useTourStepNavigation({
  steps,
  currentStepIndex,
  setCurrentStepIndex,
  onClose,
  setTourProps,
  cleanup,
  target,
}: UseTourStepNavigationArgs): TourStepNavigationHandlers {
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= steps.length || stepIndex < 0) {
        return;
      }
      setCurrentStepIndex(stepIndex);
    },
    [steps.length, setCurrentStepIndex],
  );

  const handleNextClick = useCallback(() => {
    const nextIndex = findNextVisibleStepIndex(steps, currentStepIndex);
    if (nextIndex !== undefined) {
      goToStep(nextIndex);
    }
  }, [steps, currentStepIndex, goToStep]);

  const handlePrevClick = useCallback(() => {
    const prevIndex = findPrevVisibleStepIndex(steps, currentStepIndex);
    if (prevIndex !== undefined) {
      goToStep(prevIndex);
    }
  }, [steps, currentStepIndex, goToStep]);

  const handleSkipClick = useCallback(() => {
    const skipIndex = findSkipStepIndex(steps, currentStepIndex);
    if (skipIndex !== undefined) {
      goToStep(skipIndex);
    }
  }, [steps, currentStepIndex, goToStep]);

  const closeTour = useCallback(
    (reset?: boolean) => {
      if (reset) {
        goToStep(0);
      }

      if (onClose) {
        onClose(reset);
      } else {
        setTourProps({ isOpen: false });
      }
      cleanup();
      target?.focus();
    },
    [goToStep, onClose, setTourProps, cleanup, target],
  );

  return {
    goToStep,
    handleNextClick,
    handlePrevClick,
    handleSkipClick,
    closeTour,
  };
}
