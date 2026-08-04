/**
 * Keeps the tooltip caret locked onto the active focus border while the tour moves.
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

    // Arrow length fills the separation gap so the tip meets the mask stroke.
    const arrowSize = Math.max(6, tooltipSeparation);

    const next = placeTooltipPointer({
      tooltipEl,
      targetEl,
      maskPadding,
      arrowSize,
      orientation: tooltipPosition?.orientation,
    });

    setPlacement((prev) => {
      if (
        prev &&
        next &&
        prev.side === next.side &&
        Math.abs(prev.offset - next.offset) < 0.5 &&
        prev.size === next.size &&
        (prev.base ?? prev.size) === (next.base ?? next.size) &&
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
  ]);

  React.useLayoutEffect(() => {
    recompute();
    const { schedule, cancel } = createFrameScheduler(recompute);
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    const t = window.setTimeout(recompute, 180);
    return () => {
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      cancel();
      window.clearTimeout(t);
    };
  }, [recompute, tooltipPosition?.coords?.x, tooltipPosition?.coords?.y]);

  return placement;
}
