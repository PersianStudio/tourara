/**
 * Context-bound tour host. Mount once under `<TourProvider>`.
 * Feature pages register steps via `useTour` / `useTourContext`.
 */
import { useEffect } from 'react';
import { useTourContext } from '../../context/TourContext';
import { Tour } from '../Tour';

export interface TourHostProps {
  /**
   * When this value changes, the tour resets (steps cleared, closed).
   * Pass a route pathname (or any key) to mirror route-change behavior.
   */
  resetKey?: string | number;
}

export function TourHost({ resetKey }: TourHostProps) {
  const { tourProps, setTourProps } = useTourContext();

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
