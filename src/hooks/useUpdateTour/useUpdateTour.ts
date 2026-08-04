/**
 * React wiring for tour re-layout.
 *
 * Performance contract:
 * - Listeners / focus trap install **once per step**
 * - Settle + resize paths only run geometry updates (no teardown thrash)
 * - React state updates are skipped when coords are unchanged
 */

import React from 'react';
import type { Coords, Dims } from '../../utils/dom';
import { applyTourGeometry } from './applyTourGeometry';
import { bindTourListeners } from './bindTourListeners';
import { startSettleLoop } from './startUltraFastUpdates';
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
  const tooltipCoordsRef = React.useRef<Coords | undefined>(undefined);

  const { selector, tooltipSeparation } = options;

  const writeTooltipPosition: UseUpdateTourArgs['setTooltipPosition'] = (value) => {
    setTooltipPosition((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      tooltipCoordsRef.current = next?.coords;
      return next;
    });
  };

  const updateGeometry = (allowScroll: boolean) => {
    applyTourGeometry({
      options,
      tooltip,
      tourRoot,
      setTooltipPosition: writeTooltipPosition,
      currentStepIndex,
      setTarget,
      targetPosition,
      targetSize,
      lastScrollKey,
      allowScroll,
    });
  };

  /** Full step open: cleanup → geometry (+ scroll) → bind listeners once → short settle. */
  const openStep = () => {
    cleanup();
    lastScrollKey.current = '';
    const currentTarget = applyTourGeometry({
      options,
      tooltip,
      tourRoot,
      setTooltipPosition: writeTooltipPosition,
      currentStepIndex,
      setTarget,
      targetPosition,
      targetSize,
      lastScrollKey,
      allowScroll: true,
    });

    bindTourListeners({
      options,
      tooltip,
      tourLogic,
      tourRoot,
      setTooltipPosition: writeTooltipPosition,
      currentStepIndex,
      setTarget,
      cleanupRefs,
      targetPosition,
      targetSize,
      lastScrollKey,
      currentTarget,
      tooltipCoordsRef,
    });
  };

  React.useEffect(() => {
    lastScrollKey.current = '';
  }, [currentStepIndex, selector]);

  React.useEffect(() => {
    let stopSettle: (() => void) | undefined;
    let raf = 0;

    if (!tourOpen || !tourRoot) {
      cleanup();
      return;
    }

    raf = requestAnimationFrame(() => {
      if (!tooltip.current) return;
      tooltip.current.focus({ preventScroll: true });
      openStep();
      stopSettle = startSettleLoop({
        updateGeometry: () => updateGeometry(false),
        targetPosition,
        targetSize,
        // Smooth scrollIntoView can outlast a short settle; scroll listeners
        // keep tracking, but stay alive long enough for typical page jumps.
        duration: 1600,
        stabilityThreshold: 4,
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      if (stopSettle) stopSettle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, currentStepContent, tourOpen, tourRoot, tooltipSeparation]);

  return { updateTour: openStep };
};
