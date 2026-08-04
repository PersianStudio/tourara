/**
 * React Context tour state — replaces Zustand with zero extra runtime deps.
 *
 * Wrap the app (or a subtree) in `<TourProvider>`, mount `<TourHost />`,
 * then call `useTour` / `useTourContext` from feature pages.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { tourDefaultProps } from '../constants';
import { injectTouraraStyles } from '../styles/injectStyles';
import type { TourProps } from '../types';

export type TourContextValue = {
  tourProps: Partial<TourProps> & { isOpen: boolean };
  setTourProps: (updatedProps?: Partial<TourProps>) => void;
};

const TourContext = createContext<TourContextValue | null>(null);

const noopSetTourProps: TourContextValue['setTourProps'] = () => undefined;

export type TourProviderProps = {
  children: ReactNode;
  /** Seed props merged over defaults (e.g. `direction`). */
  initialProps?: Partial<TourProps>;
};

export function TourProvider({ children, initialProps }: TourProviderProps) {
  useEffect(() => {
    injectTouraraStyles();
  }, []);

  const [tourProps, setTourPropsState] = useState<Partial<TourProps> & { isOpen: boolean }>({
    ...tourDefaultProps,
    isOpen: false,
    ...initialProps,
  });

  const setTourProps = useCallback((updatedProps: Partial<TourProps> = {}) => {
    setTourPropsState((prev) => ({
      ...prev,
      ...updatedProps,
    }));
  }, []);

  const value = useMemo(
    () => ({
      tourProps,
      setTourProps,
    }),
    [tourProps, setTourProps],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

/** Safe for controlled `<Tour />` outside a provider (setTourProps is a no-op). */
export function useOptionalTourContext(): TourContextValue {
  return useContext(TourContext) ?? { tourProps: { isOpen: false }, setTourProps: noopSetTourProps };
}

/**
 * Read / write the shared tour props. Must be used under `<TourProvider>`.
 */
export function useTourContext(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error('useTourContext must be used within a <TourProvider>.');
  }
  return ctx;
}

/**
 * Alias kept for a familiar API surface (`useTourStore` → context).
 * Prefer `useTourContext` in new code.
 */
export const useTourStore = useTourContext;

export type TourState = TourContextValue;
