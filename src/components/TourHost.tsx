import { useEffect } from 'react';
import { useTourStore } from '../store/tourStore';
import { Tour } from './Tour';

export interface TourHostProps {
  /**
   * When this value changes, the tour resets (steps cleared, closed).
   * Pass a route pathname (or any key) to mirror route-change behavior.
   */
  resetKey?: string | number;
}

/**
 * Store-bound tour host. Mount once near the app root.
 * Feature pages register steps via `useTour` / `useTourStore`.
 */
export function TourHost({ resetKey }: TourHostProps) {
  const { tourProps, setTourProps } = useTourStore();

  useEffect(() => {
    if (resetKey === undefined) return;
    if (tourProps.steps?.length || tourProps.isOpen) {
      setTourProps({
        steps: [],
        isOpen: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return <Tour {...tourProps} steps={tourProps.steps?.length ? tourProps.steps : []} />;
}
