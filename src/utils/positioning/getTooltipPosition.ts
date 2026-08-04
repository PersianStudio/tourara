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
  // Do NOT add scroll offsets; those desync the tooltip/mask from the target when the page scrolls.
  const adjustedPosition: OrientationCoords = {
    orientation: rawPosition.orientation,
    coords: rawPosition.coords,
  };

  if (foreignTarget) {
    return {
      orientation: adjustedPosition.orientation,
      coords: restrictToCurrentViewport(
        tourRoot,
        adjustedPosition.coords,
        getElementDims(tooltip),
        padding + tooltipSeparation,
      ),
    };
  }

  return adjustedPosition;
}

/** Viewport coordinates of the target for the fixed tour portal. */
export function getTargetPosition(_root: Element, target: HTMLElement): Coords {
  // Viewport coordinates for the fixed tour portal.
  return getElementCoords(target);
}
