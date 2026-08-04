/**
 * Keeps the tooltip caret locked onto the active focus border while the tour moves.
 * Uses intended shell coords during CSS top/left transitions so the caret rides
 * with the card instead of re-aiming from mid-animation getBoundingClientRect.
 */
import * as React from 'react';
import type { TourStep } from '../../types';
import type { OrientationCoords } from '../../utils/positioning';
import { createFrameScheduler } from '../../utils/frameScheduler';
import { placeTooltipPointer, type PointerPlacement } from './placeTooltipPointer';

interface UseTooltipPointerArgs {
  tooltipPosition: OrientationCoords | undefined;
  stepIndex: number;
  allSteps: TourStep[];
  /** Inner tooltip card — caret is positioned relative to this box. */
  cardRef: React.RefObject<HTMLElement | null>;
  corner: TourStep['corner'];
  maskPadding?: number;
  tooltipSeparation?: number;
}

export function useTooltipPointer({
  tooltipPosition,
  stepIndex,
  allSteps,
  cardRef,
  corner,
  maskPadding = 0,
  tooltipSeparation = 10,
}: UseTooltipPointerArgs): PointerPlacement | null {
  const [placement, setPlacement] = React.useState<PointerPlacement | null>(null);
  const transitioning = React.useRef(false);

  const recompute = React.useCallback(() => {
    if (corner === 'none') {
      setPlacement(null);
      return;
    }

    const tooltipEl = cardRef.current;
    const selector = allSteps?.[stepIndex]?.selector;
    if (!tooltipEl || !selector) {
      setPlacement(null);
      return;
    }

    const targetEl = document.querySelector(selector) as HTMLElement | null;
    if (!targetEl) {
      setPlacement(null);
      return;
    }

    // Arrow length matches the separation gap (same as edge carets).
    const arrowSize = Math.max(6, tooltipSeparation);

    // Prefer destination shell coords so mid-transition getBoundingClientRect
    // never stretches/detaches the caret from the moving card.
    const next = placeTooltipPointer({
      tooltipEl,
      targetEl,
      maskPadding,
      arrowSize,
      orientation: tooltipPosition?.orientation,
      intendedCoords: tooltipPosition?.coords ?? null,
    });

    setPlacement((prev) => {
      if (
        prev &&
        next &&
        prev.side === next.side &&
        Math.abs(prev.offset - next.offset) < 0.5 &&
        prev.size === next.size &&
        Math.abs((prev.rotation ?? 0) - (next.rotation ?? 0)) < 0.5
      ) {
        return prev;
      }
      return next;
    });
  }, [
    corner,
    cardRef,
    allSteps,
    stepIndex,
    maskPadding,
    tooltipSeparation,
    tooltipPosition?.orientation,
    tooltipPosition?.coords?.x,
    tooltipPosition?.coords?.y,
  ]);

  React.useLayoutEffect(() => {
    recompute();
    const { schedule, cancel } = createFrameScheduler(recompute);
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { capture: true, passive: true });

    const shell = cardRef.current?.closest('.tourara-tooltip-shell') as HTMLElement | null;
    const onTransitionStart = (event: TransitionEvent) => {
      if (event.target !== shell) return;
      if (event.propertyName !== 'top' && event.propertyName !== 'left') return;
      transitioning.current = true;
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== shell) return;
      if (event.propertyName !== 'top' && event.propertyName !== 'left') return;
      transitioning.current = false;
      recompute();
    };

    shell?.addEventListener('transitionstart', onTransitionStart);
    shell?.addEventListener('transitionend', onTransitionEnd);

    // Safety: transition may be disabled / interrupted.
    const settle = window.setTimeout(() => {
      transitioning.current = false;
      recompute();
    }, 220);

    return () => {
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      shell?.removeEventListener('transitionstart', onTransitionStart);
      shell?.removeEventListener('transitionend', onTransitionEnd);
      cancel();
      window.clearTimeout(settle);
    };
  }, [recompute, cardRef, tooltipPosition?.coords?.x, tooltipPosition?.coords?.y]);

  return placement;
}
