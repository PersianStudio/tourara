import { tourDefaultProps } from '../../constants';
import type { TourOptions, TourProps, TourStep } from '../../types';

/**
 * Merges package defaults, tour props, and the active step into one options
 * object (step fields win over tour-level props).
 */
export function useMergedTourOptions(
  props: TourProps,
  currentStepContent: TourStep | undefined,
): TourOptions & TourProps & TourStep {
  return {
    ...tourDefaultProps,
    ...props,
    ...currentStepContent,
  } as TourOptions & TourProps & TourStep;
}
