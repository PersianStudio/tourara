//@ts-nocheck

/**
 * Main entry points for tooltip and target positioning in the tour portal.
 */

import {
  Coords,
  getElementCoords,
  getElementDims,
  isForeignTarget,
} from '../dom';
import {
  centerViewportAroundElement,
  getViewportCenter,
} from '../offset';
import { getScrolledViewportPosition } from '../viewport';
import { getTooltipPositionCandidates } from './candidates';
import {
  chooseBestTooltipPosition,
  getPreferredCandidates,
  restrictToCurrentViewport,
} from './chooseBest';
import {
  CardinalOrientation,
  GetTooltipPositionArgs,
  OrientationCoords,
} from './orientations';

/**
 * Computes the tooltip's orientation and viewport coordinates for the given
 * target, respecting orientation preferences and foreign-target constraints.
 */
export function getTooltipPosition(args: GetTooltipPositionArgs): OrientationCoords {
  const {
    target,
    tooltip,
    padding,
    tooltipSeparation,
    orientationPreferences,
    getPositionFromCandidates,
    root: tourRoot,
    disableAutoScroll: scrollDisabled,
    allowForeignTarget,
    selector,
    isPreferredCandidatesIncluded = true,
  } = args;
  const center: Coords = target
    ? getViewportCenter(
        tourRoot,
        tooltip,
        getScrolledViewportPosition(tourRoot, centerViewportAroundElement(tourRoot, target)),
      )
    : getViewportCenter(tourRoot, tooltip);
  // Fixed portal → viewport space (no scroll offset)
  const defaultPosition: Coords = center || { x: 16, y: 16 };

  if (!tooltip || !tourRoot) {
    return;
  }

  if (!target) {
    return { orientation: null, coords: defaultPosition };
  }

  const foreignTarget: boolean = allowForeignTarget && isForeignTarget(tourRoot, selector);
  const noScroll: boolean = scrollDisabled || foreignTarget;
  const candidates: OrientationCoords[] = getTooltipPositionCandidates(
    target,
    tooltip,
    padding,
    tooltipSeparation,
    true,
    isPreferredCandidatesIncluded,
  );
  const choosePosition =
    getPositionFromCandidates ||
    ((cans: OrientationCoords[]) => chooseBestTooltipPosition(cans, tourRoot, tooltip, target, noScroll));

  const rawPosition: OrientationCoords = choosePosition(getPreferredCandidates(candidates, orientationPreferences)); //position relative to current viewport

  if (!rawPosition) {
    return { orientation: CardinalOrientation.CENTER, coords: defaultPosition };
  }

  // Portal overlay is `position: fixed` — use viewport coordinates (getBoundingClientRect space).
  // Always clamp so small screens never leave the shell off-screen / clipped.
  const inset = Math.max(8, (padding || 0) + (tooltipSeparation || 0) * 0.35);
  const clamped = restrictToCurrentViewport(
    tourRoot,
    rawPosition.coords,
    getElementDims(tooltip),
    inset,
  );

  return {
    orientation: rawPosition.orientation,
    coords: clamped,
  };
}

/** Viewport coordinates of the target for the fixed tour portal. */
export function getTargetPosition(_root: Element, target: HTMLElement): Coords {
  // Viewport coordinates for the fixed tour portal.
  return getElementCoords(target);
}
