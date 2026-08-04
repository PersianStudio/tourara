import { useEffect } from 'react';
import { useTourStore } from '../store/tourStore';
import type { TourProps } from '../types';

export interface UseTourOptions {
  tourOptions: Partial<TourProps>;
  /** Delay in ms before applying tour options. Default 100. */
  delay?: number;
  /** Apply tour options immediately (no delay). */
  openImmediately?: boolean;
}

/**
 * Registers tour steps / options into the shared tour store on mount.
 */
export function useTour({ tourOptions, delay = 100, openImmediately = false }: UseTourOptions) {
  const { setTourProps: setStoreTourProps, tourProps } = useTourStore();

  useEffect(() => {
    if (openImmediately) {
      setStoreTourProps({ ...tourOptions });
      return;
    }

    const timer = setTimeout(() => {
      setStoreTourProps({ ...tourOptions });
    }, delay);

    return () => {
      clearTimeout(timer);
    };
    // Intentionally mount-driven like the original ICE hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openImmediately, delay]);

  return { tourProps, setTourProps: setStoreTourProps };
}
