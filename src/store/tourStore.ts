/**
 * Zustand store holding the active tour props and open state.
 */

import { create } from 'zustand';
import { tourDefaultProps } from '../constants';
import type { TourProps } from '../types';

export interface TourState {
  tourProps: Partial<TourProps> & { isOpen: boolean };
  setTourProps: (updatedProps?: Partial<TourProps>) => void;
}

export const useTourStore = create<TourState>()((set) => ({
  tourProps: { ...tourDefaultProps, isOpen: false },

  setTourProps: (updatedProps = {}) =>
    set((state) => ({
      tourProps: {
        ...state.tourProps,
        ...updatedProps,
      },
    })),
}));

/** Factory for apps that need an isolated tour store instance. */
export function createTourStore(initial?: Partial<TourProps>) {
  return create<TourState>()((set) => ({
    tourProps: { ...tourDefaultProps, isOpen: false, ...initial },
    setTourProps: (updatedProps = {}) =>
      set((state) => ({
        tourProps: {
          ...state.tourProps,
          ...updatedProps,
        },
      })),
  }));
}
