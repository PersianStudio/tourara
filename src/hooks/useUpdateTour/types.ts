/**
 * Argument shape for the useUpdateTour hook — keeps the hook signature readable
 * while the implementation lives across focused modules.
 */

import type React from 'react';
import type { TourLogic, TourOptions, TourProps, TourStep } from '../../types';
import type { OrientationCoords } from '../../utils/positioning';

export interface UseUpdateTourArgs {
  options: TourOptions & TourProps & TourStep;
  tourOpen: boolean;
  tooltip: React.MutableRefObject<HTMLElement | undefined>;
  cleanup: () => void;
  tourLogic: TourLogic;
  tourRoot: Element | undefined;
  setTooltipPosition: React.Dispatch<React.SetStateAction<OrientationCoords | undefined>>;
  currentStepIndex: number;
  currentStepContent: TourStep;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
  cleanupRefs: React.MutableRefObject<(() => void)[]>;
  target: HTMLElement | undefined;
  waitForTargetsTimeOut?: number;
}
