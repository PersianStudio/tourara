/**
 * Runtime tour controller surface passed to custom renderers and step content.
 * Holds navigation actions plus the active step / tooltip placement state.
 */

import type { TourDirection } from '../utils/direction';
import type { OrientationCoords } from '../utils/positioning';
import type { TourStep } from './TourOptions';

export interface TourLogic {
  next: (fromTarget?: boolean) => void;
  skip: (fromTarget?: boolean) => void;
  prev: () => void;
  close: (reset?: boolean) => void;
  goToStep: (stepNumber: number) => void;
  stepContent: TourStep;
  stepIndex: number;
  allSteps: TourStep[];
  tooltipPosition: OrientationCoords | undefined;
  /** Active text/layout direction for this tour. */
  direction: TourDirection;
}
