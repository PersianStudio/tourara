/**
 * Coordinates placement of inactive tip markers with a low resource budget.
 *
 * Hard rules:
 * - Never paint over the active tooltip (obstacle + z-index below chrome)
 * - Never paint inside the spotlight hole
 * - Hide a tip entirely when no clear slot exists (no “best effort” overlap)
 * - Recompute when the tooltip moves (coords + post-transition settle)
 */
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { baseTooltipContainerString } from '../../constants';
import type { TourStep } from '../../types';
import { defaultTipOrientations, resolveOrientationPreferences, type TourDirection } from '../../utils/direction';
import { createFrameScheduler } from '../../utils/frameScheduler';
import type { OrientationCoords } from '../../utils/positioning';
import { getIdString } from '../../utils/tour';
import {
  SIBLING_TARGET_PAD,
  TIP_CLEARANCE,
  TIP_SIZE,
  TOOLTIP_OBSTACLE_PAD,
} from './constants';
import { placeTipMarker, spotlightObstacle, tooltipObstacle } from './placeTipMarker';
import {
  inflateRect,
  isMostlyInside,
  rectCenterDistance,
  rectsOverlap,
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
  /** When tooltip coords change, tips must re-resolve against the new chrome box. */
  tooltipPosition?: OrientationCoords;
  identifier?: string;
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

/** Resolve the live tooltip box — ref first, then DOM id fallback. */
function measureTooltip(
  tooltipRef: React.RefObject<HTMLElement | undefined> | undefined,
  identifier?: string,
): TipRect | null {
  const fromRef = tooltipObstacle(tooltipRef?.current, TOOLTIP_OBSTACLE_PAD);
  if (fromRef) return fromRef;

  const id = getIdString(baseTooltipContainerString, identifier);
  const el = document.getElementById(id);
  return tooltipObstacle(el, TOOLTIP_OBSTACLE_PAD);
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
  tooltipPosition,
  identifier,
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
    // Prefer live DOM measure; when the shell exists but is still 0×0 (opening),
    // skip tips entirely so we never place against a missing obstacle.
    const tooltip = measureTooltip(tooltipRef, identifier);
    if (tooltipPosition && !tooltip) {
      setPlaced((prev) => (prev.length ? [] : prev));
      return;
    }

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

      // Target sits in the spotlight hole — tip would read as “inside” the focus.
      if (spotlight && isMostlyInside(targetRect, spotlight, 0.45)) continue;

      // Target itself is under / kissing the tooltip chrome — skip (no good side).
      if (tooltip && rectsOverlap(targetRect, tooltip, TIP_CLEARANCE)) continue;

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

      const obstacles = [...hardObstacles, ...siblingObstacles, ...placedMarkerObstacles];

      const result = placeTipMarker(c.target, {
        preferences: prefs,
        obstacles,
        clearance: TIP_CLEARANCE,
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

      // Final gate: never ship a tip that still intersects the tooltip box.
      const tipBox = tipMarkerRect(result.x, result.y, TIP_SIZE);
      if (tooltip && rectsOverlap(tipBox, tooltip, TIP_CLEARANCE)) continue;
      if (spotlight && rectsOverlap(tipBox, spotlight, TIP_CLEARANCE)) continue;

      next.push({ index: c.index, x: result.x, y: result.y });
      placedMarkerObstacles.push(tipBox);
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
    identifier,
    defaultPrefs,
    tooltipPosition,
    tooltipPosition?.coords?.x,
    tooltipPosition?.coords?.y,
    tooltipPosition?.orientation,
  ]);

  useLayoutEffect(() => {
    if (disableTips) {
      setPlaced([]);
      return;
    }

    recompute();

    const { schedule, cancel } = createFrameScheduler(recompute);
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { capture: true, passive: true });

    const shell = tooltipRef?.current ?? document.getElementById(getIdString(baseTooltipContainerString, identifier));
    const onTransitionEnd = (e: Event) => {
      const te = e as TransitionEvent;
      if (te.target !== shell) return;
      if (te.propertyName !== 'top' && te.propertyName !== 'left') return;
      recompute();
    };
    shell?.addEventListener('transitionend', onTransitionEnd);

    // Tooltip CSS transition (~160ms) — settle tips against the final chrome box.
    const t1 = window.setTimeout(recompute, 50);
    const t2 = window.setTimeout(recompute, 180);
    const t3 = window.setTimeout(recompute, 320);

    return () => {
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      shell?.removeEventListener('transitionend', onTransitionEnd);
      cancel();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [recompute, disableTips, tooltipRef, identifier]);

  if (disableTips || placed.length === 0) return null;

  return (
    <>
      {placed.map((tip) => (
        <TipMarker key={tip.index} x={tip.x} y={tip.y} stepIndex={tip.index} onActivate={goToStep} />
      ))}
    </>
  );
}
