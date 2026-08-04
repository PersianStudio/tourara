/**
 * React wiring for tour re-layout: holds geometry refs, resets scroll keys on
 * step change, focuses the tooltip with preventScroll, and kicks off the
 * ultra-fast rAF settle burst while the tour is open.
 */

import React from 'react';
import type { Coords, Dims } from '../../utils/dom';
import { runTourUpdate } from './runTourUpdate';
import { startUltraFastUpdates } from './startUltraFastUpdates';
import type { UseUpdateTourArgs } from './types';

export const useUpdateTour = ({
  options,
  tourOpen,
  tooltip,
  cleanup,
  tourLogic,
  tourRoot,
  setTooltipPosition,
  currentStepIndex,
  currentStepContent,
  setTarget,
  cleanupRefs,
}: UseUpdateTourArgs) => {
  const targetPosition = React.useRef<Coords | null>(null);
  const targetSize = React.useRef<Dims | null>(null);
  const lastScrollKey = React.useRef('');

  const {
    selector,
    tooltipSeparation,
  } = options;

  const updateTour = () => {
    runTourUpdate({
      options,
      tooltip,
      cleanup,
      tourLogic,
      tourRoot,
      setTooltipPosition,
      currentStepIndex,
      setTarget,
      cleanupRefs,
      targetPosition,
      targetSize,
      lastScrollKey,
    });
  };

  React.useEffect(() => {
    lastScrollKey.current = '';
  }, [currentStepIndex, selector]);

  React.useEffect(() => {
    let stopUltraFastUpdates: (() => void) | undefined;
    let raf = 0;

    if (!tourOpen || !tourRoot) {
      cleanup();
      return;
    }

    raf = requestAnimationFrame(() => {
      if (tooltip.current) {
        tooltip.current.focus({ preventScroll: true });
        stopUltraFastUpdates = startUltraFastUpdates({
          updateTour,
          targetPosition,
          targetSize,
          duration: 1800,
          stabilityThreshold: 5,
        });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      if (stopUltraFastUpdates) stopUltraFastUpdates();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, currentStepContent, tourOpen, tourRoot, tooltipSeparation]);

  return { updateTour };
};
