export { Tour } from './components/Tour';
export { TourHost } from './components/TourHost';
export type { TourHostProps } from './components/TourHost';
export { Mask } from './components/Mask';
export type { MaskOptions } from './components/Mask';
export { Tooltip } from './components/Tooltip';
export { Tip } from './components/Tip';

export { tourDefaultProps } from './constants';
export type { TourStep, TourLogic, TourOptions, TourProps, TourDirection } from './types';

export { useTour, useUpdateTour, useDetectVisibility } from './hooks';
export type { UseTourOptions } from './hooks/useTour';

export {
  TourProvider,
  useTourContext,
  useTourStore,
} from './context/TourContext';
export type { TourState, TourContextValue, TourProviderProps } from './context/TourContext';

export { CardinalOrientation } from './utils/positioning';
export type { Coords, Dims, ElementInfo } from './utils/dom';
export {
  mirrorOrientation,
  resolveOrientationPreferences,
  defaultTipOrientations,
} from './utils/direction';
export {
  waitForElement,
  isElementPresent,
  clickOnElement,
  conditionalTourAction,
} from './utils/tourActions';
