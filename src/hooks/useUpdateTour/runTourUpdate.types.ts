/**
 * Shared arg bag for the legacy runTourUpdate entry (geometry + listeners).
 */

import type React from 'react';
import type { TourLogic, TourOptions, TourProps, TourStep } from '../../types';
import type { Coords, Dims } from '../../utils/dom';
import type { OrientationCoords } from '../../utils/positioning';

export interface RunTourUpdateArgs {
  options: TourOptions & TourProps & TourStep;
  tooltip: React.MutableRefObject<HTMLElement | undefined>;
  cleanup: () => void;
  tourLogic: TourLogic;
  tourRoot: Element | undefined;
  setTooltipPosition: React.Dispatch<React.SetStateAction<OrientationCoords | undefined>>;
  currentStepIndex: number;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
  cleanupRefs: React.MutableRefObject<(() => void)[]>;
  targetPosition: React.MutableRefObject<Coords | null>;
  targetSize: React.MutableRefObject<Dims | null>;
  lastScrollKey: React.MutableRefObject<string>;
}
