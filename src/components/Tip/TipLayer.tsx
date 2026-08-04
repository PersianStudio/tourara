/**
 * Coordinates placement of all inactive tip markers in one pass.
 *
 * Individual tips used to place themselves independently, which caused:
 * - markers sitting on the active spotlight / tooltip
 * - markers stacking when targets are close
 * - markers landing on a sibling target that already has (or needs) its own tip
 *
 * TipLayer gathers obstacles once, places nearest tips first, and hides any
 * tip that cannot find a clear slot.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { TourStep } from '../../types';
import { defaultTipOrientations, resolveOrientationPreferences, type TourDirection } from '../../utils/direction';
import { isElementInView as utilIsElementInView } from '../../utils/viewport';
import { SIBLING_TARGET_PAD, TIP_SIZE } from './constants';
import { placeTipMarker, spotlightObstacle, tooltipObstacle } from './placeTipMarker';
import {
  inflateRect,
  isMostlyInside,
  rectCenterDistance,
  tipMarkerRect,
  toTipRect,
  type TipRect,
} from './tipGeometry';
import { TipMarker } from './TipMarker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isElementInView = utilIsElementInView as any;

export type TipLayerProps = {
  steps: (TourStep & { isVisible?: boolean })[];
  currentStepIndex: number;
  tourRoot: Element;
  direction: TourDirection;
  goToStep: (stepIndex: number) => void;
  /** Active spotlight target — tips must not cover this hole. */
  activeTarget?: HTMLElement;
  /** Mask padding expands the spotlight obstacle. */
  maskPadding?: number;
  /** Live tooltip container ref — read on each recompute. */
  tooltipRef?: React.RefObject<HTMLElement | undefined>;
};

type PlacedTip = {
  index: number;
  x: number;
  y: number;
};

function resolveTarget(step: TourStep, tourRoot: Element): HTMLElement | null {
  return (
    (document.querySelector(step.selector) as HTMLElement | null) ||
    (tourRoot.querySelector(step.selector) as HTMLElement | null) ||
    null
  );
}

function isOnScreen(tourRoot: Element, target: HTMLElement): boolean {
  const visible = isElementInView(tourRoot, target);
  const rect = target.getBoundingClientRect();
  return (
    Boolean(visible) &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

export function TipLayer({
  steps,
  currentStepIndex,
  tourRoot,
  direction,
  goToStep,
  activeTarget,
  maskPadding = 0,
  tooltipRef,
}: TipLayerProps) {
  const [placed, setPlaced] = useState<PlacedTip[]>([]);
  const rafRef = useRef(0);

  const recompute = useCallback(() => {
    const spotlight = spotlightObstacle(activeTarget, maskPadding);
    const tooltip = tooltipObstacle(tooltipRef?.current, 12);

    type Candidate = {
      index: number;
      step: TourStep;
      target: HTMLElement;
      targetRect: TipRect;
      distance: number;
    };

    const candidates: Candidate[] = [];

    for (let index = 0; index < steps.length; index++) {
      if (index === currentStepIndex) continue;
      const step = steps[index];
      if (step.isVisible === false) continue;

      const target = resolveTarget(step, tourRoot);
      if (!target || !isOnScreen(tourRoot, target)) continue;

      const targetRect = toTipRect(target.getBoundingClientRect());

      // Target lives inside the active focus hole — tip would read as "inside" the tour.
      if (spotlight && isMostlyInside(targetRect, spotlight, 0.45)) continue;

      const distance = spotlight ? rectCenterDistance(targetRect, spotlight) : index;
      candidates.push({ index, step, target, targetRect, distance });
    }

    // Closest-to-spotlight first: crowded UI near the active step claims clear sides first.
    candidates.sort((a, b) => a.distance - b.distance || a.index - b.index);

    const hardObstacles: TipRect[] = [];
    if (spotlight) hardObstacles.push(spotlight);
    if (tooltip) hardObstacles.push(tooltip);

    // Soft pads keyed by step index — exclude a tip's own target when placing it.
    const siblingSoft = new Map<number, TipRect>();
    for (const c of candidates) {
      siblingSoft.set(c.index, inflateRect(c.targetRect, SIBLING_TARGET_PAD));
    }

    const placedMarkerObstacles: TipRect[] = [];
    const next: PlacedTip[] = [];

    for (const c of candidates) {
      const siblingObstacles: TipRect[] = [];
      for (const [idx, rect] of siblingSoft) {
        if (idx !== c.index) siblingObstacles.push(rect);
      }

      const obstaclesForTip = [...hardObstacles, ...siblingObstacles, ...placedMarkerObstacles];

      const prefs =
        resolveOrientationPreferences(c.step.tipOrientationPreferences, direction) ||
        defaultTipOrientations(direction);

      const result = placeTipMarker(c.target, {
        preferences: prefs,
        obstacles: obstaclesForTip,
      });

      if (!result) continue;

      next.push({ index: c.index, x: result.x, y: result.y });
      placedMarkerObstacles.push(tipMarkerRect(result.x, result.y, TIP_SIZE));
    }

    setPlaced((prev) => {
      if (
        prev.length === next.length &&
        prev.every((p, i) => p.index === next[i].index && p.x === next[i].x && p.y === next[i].y)
      ) {
        return prev;
      }
      return next;
    });
  }, [steps, currentStepIndex, tourRoot, direction, activeTarget, maskPadding, tooltipRef]);

  const schedule = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => recompute());
  }, [recompute]);

  useEffect(() => {
    recompute();
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    const id = window.setInterval(recompute, 120);
    return () => {
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      window.clearInterval(id);
      cancelAnimationFrame(rafRef.current);
    };
  }, [recompute, schedule]);

  return (
    <>
      {placed.map((tip) => (
        <TipMarker key={tip.index} x={tip.x} y={tip.y} onActivate={() => goToStep(tip.index)} />
      ))}
    </>
  );
}
