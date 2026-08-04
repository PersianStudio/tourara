import type { TourLogic, TourOptions, TourProps, TourStep } from '../../types';
import type { OrientationCoords } from '../../utils/positioning';

export interface BuildTourLogicArgs {
  next: () => void;
  skip: () => void;
  prev: () => void;
  close: (reset?: boolean) => void;
  goToStep: (stepIndex: number) => void;
  /** Merged defaults + props + current step (used as `stepContent`). */
  options: TourOptions & TourProps & TourStep;
  currentStepIndex: number;
  steps: TourStep[];
  tooltipPosition: OrientationCoords | undefined;
  direction: TourLogic['direction'];
  customNextFunc?: TourOptions['customNextFunc'];
  customPrevFunc?: TourOptions['customPrevFunc'];
  customCloseFunc?: TourOptions['customCloseFunc'];
}

/**
 * Builds the public `TourLogic` object, wrapping next/prev/close with
 * optional custom handlers when provided on options / the current step.
 */
export function buildTourLogic({
  next,
  skip,
  prev,
  close,
  goToStep,
  options,
  currentStepIndex,
  steps,
  tooltipPosition,
  direction,
  customNextFunc,
  customPrevFunc,
  customCloseFunc,
}: BuildTourLogicArgs): TourLogic {
  const baseLogic: TourLogic = {
    next,
    skip,
    prev,
    close: (reset?: boolean) => close(reset),
    goToStep,
    stepContent: { ...options },
    stepIndex: currentStepIndex,
    allSteps: steps,
    tooltipPosition,
    direction,
  };

  return {
    ...baseLogic,
    ...(customNextFunc && {
      next: (fromTarget?: boolean) => {
        customNextFunc(baseLogic, fromTarget);
      },
    }),
    ...(customPrevFunc && {
      prev: () => {
        customPrevFunc(baseLogic);
      },
    }),
    ...(customCloseFunc && {
      close: () => {
        customCloseFunc(baseLogic);
      },
    }),
  };
}
