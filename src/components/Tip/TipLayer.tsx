/**
 * Coordinates placement of inactive tip markers with a low resource budget.
 *
 * - No polling interval
 * - Scroll/resize coalesced to one rAF
 * - Cap tips nearest the spotlight
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { TourStep } from '../../types';
import { defaultTipOrientations, resolveOrientationPreferences, type TourDirection } from '../../utils/direction';
import { createFrameScheduler } from '../../utils/frameScheduler';
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

const MAX_TIPS = 6;

export type TipLayerProps = {
  steps: (TourStep & { isVisible?: boolean })[];
  currentStepIndex: number;
  tourRoot: Element;
  direction: TourDirection;
  goToStep: (stepIndex: number) => void;
  activeTarget?: HTMLElement;
  maskPadding?: number;
  tooltipRef?: React.RefObject<HTMLElement | undefined>;
  disableTips?: boolean;
};

type PlacedTip = { index: number; x: number; y: number };

function resolveTarget(step: TourStep, tourRoot: Element): HTMLElement | null {
  return (
    (tourRoot.querySelector(step.selector) as HTMLElement | null) ||
    (document.querySelector(step.selector) as HTMLElement | null) ||
    null
  );
}

function isOnScreen(target: HTMLElement): boolean {
  const rect = target.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

function placementsEqual(a: PlacedTip[], b: PlacedTip[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].index !== b[i].index || a[i].x !== b[i].x || a[i].y !== b[i].y) return false;
  }
  return true;
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
  disableTips = false,
}: TipLayerProps) {
  const [placed, setPlaced] = useState<PlacedTip[]>([]);
  const defaultPrefs = useMemo(() => defaultTipOrientations(direction), [direction]);

  const recompute = useCallback(() => {
    if (disableTips) {
      setPlaced((prev) => (prev.length ? [] : prev));
      return;
    }

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
      if (!target || !isOnScreen(target)) continue;

      const domRect = target.getBoundingClientRect();
      const targetRect = toTipRect(domRect);
      if (spotlight && isMostlyInside(targetRect, spotlight, 0.45)) continue;

      candidates.push({
        index,
        step,
        target,
        targetRect,
        distance: spotlight ? rectCenterDistance(targetRect, spotlight) : index,
      });
    }

    candidates.sort((a, b) => a.distance - b.distance || a.index - b.index);
    const limited = candidates.slice(0, MAX_TIPS);

    const hardObstacles: TipRect[] = [];
    if (spotlight) hardObstacles.push(spotlight);
    if (tooltip) hardObstacles.push(tooltip);

    const siblingSoft = new Map<number, TipRect>();
    for (const c of limited) {
      siblingSoft.set(c.index, inflateRect(c.targetRect, SIBLING_TARGET_PAD));
    }

    const placedMarkerObstacles: TipRect[] = [];
    const next: PlacedTip[] = [];

    for (const c of limited) {
      const siblingObstacles: TipRect[] = [];
      for (const [idx, rect] of siblingSoft) {
        if (idx !== c.index) siblingObstacles.push(rect);
      }

      const prefs =
        resolveOrientationPreferences(c.step.tipOrientationPreferences, direction) || defaultPrefs;

      const result = placeTipMarker(c.target, {
        preferences: prefs,
        obstacles: [...hardObstacles, ...siblingObstacles, ...placedMarkerObstacles],
        targetRect: {
          left: c.targetRect.left,
          top: c.targetRect.top,
          right: c.targetRect.right,
          bottom: c.targetRect.bottom,
          width: c.targetRect.right - c.targetRect.left,
          height: c.targetRect.bottom - c.targetRect.top,
        },
      });

      if (!result) continue;
      next.push({ index: c.index, x: result.x, y: result.y });
      placedMarkerObstacles.push(tipMarkerRect(result.x, result.y, TIP_SIZE));
    }

    setPlaced((prev) => (placementsEqual(prev, next) ? prev : next));
  }, [
    disableTips,
    steps,
    currentStepIndex,
    tourRoot,
    direction,
    activeTarget,
    maskPadding,
    tooltipRef,
    defaultPrefs,
  ]);

  useEffect(() => {
    if (disableTips) {
      setPlaced([]);
      return;
    }

    const { schedule, cancel } = createFrameScheduler(recompute);
    recompute();

    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { capture: true, passive: true });

    return () => {
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      cancel();
    };
  }, [recompute, disableTips]);

  if (disableTips || placed.length === 0) return null;

  return (
    <>
      {placed.map((tip) => (
        <TipMarker key={tip.index} x={tip.x} y={tip.y} stepIndex={tip.index} onActivate={goToStep} />
      ))}
    </>
  );
}
