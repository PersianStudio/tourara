//@ts-nocheck

/**
 * Selection helpers: pick the best tooltip candidate and clamp to the viewport.
 */

import {
  Coords,
  Dims,
  dist,
  fitsWithin,
  getCombinedData,
  getElementCoords,
  getElementDims,
  isWithinAt,
} from '../dom';
import {
  centerViewportAroundElements,
  getViewportCenter,
} from '../offset';
import {
  getScrolledViewportPosition,
  getViewportDims,
  getViewportScrollEnd,
  getViewportScrollStart,
  getViewportStart,
  isElementInView,
} from '../viewport';
import { CardinalOrientation, OrientationCoords } from './orientations';

/** Reducer that prefers candidates closest to the current (or predicted) viewport center. */
function getCenterReducer(
  root: Element,
  tooltip: HTMLElement,
  target: HTMLElement,
  predictViewport?: boolean,
): (acc: OrientationCoords, cur: OrientationCoords, ind: number, arr: OrientationCoords[]) => OrientationCoords {
  const currentCenter: Coords = getViewportCenter(root, tooltip);

  // store the center of the predicted viewport location with the tooltip at acc
  // to have a meaningful distance comparison
  let accCenter: Coords = currentCenter;

  const getCenter = (coords: Coords) => {
    if (predictViewport && (!isElementInView(root, target) || !isElementInView(root, tooltip, coords, true))) {
      return getViewportCenter(
        root,
        tooltip,
        getScrolledViewportPosition(root, centerViewportAroundElements(root, tooltip, target, coords)),
      );
    }
    return currentCenter;
  };

  return (acc: OrientationCoords, cur: OrientationCoords, ind: number, arr: OrientationCoords[]): OrientationCoords => {
    if (cur.orientation === CardinalOrientation.CENTER) {
      //ignore centered coords since those will always be closest to the center
      if (ind === arr.length - 1 && acc === undefined) {
        //unless  we're at the end and we still haven't picked a coord
        return cur;
      }
      return acc;
    }
    if (acc === undefined) {
      accCenter = getCenter(cur.coords);
      return cur;
    }
    const center: Coords = getCenter(cur.coords);

    if (dist(center, cur.coords) > dist(accCenter, acc.coords)) {
      return acc;
    }
    accCenter = center;
    return cur;
  };
}

/**
 * Chooses the best tooltip placement from candidates, preferring positions that
 * keep both target and tooltip in view (with scroll when allowed).
 */
export function chooseBestTooltipPosition(
  preferredCandidates: OrientationCoords[],
  root: Element,
  tooltip: HTMLElement,
  target: HTMLElement,
  scrollDisabled: boolean,
): OrientationCoords {
  if (!preferredCandidates || preferredCandidates.length === 0) {
    return undefined;
  }
  if (scrollDisabled) {
    // if scrolling is disabled, there's not much we can do except use the naive center reducer
    return preferredCandidates.reduce(getCenterReducer(root, tooltip, target, false), undefined);
  }
  // scrolling is allowed, which means we have to figure out:
  // 1. what candidates are valid positions (not out of the scrolling root's bounds)
  // 2. which positions are absolutely compatible (allow both target & tooltip to fit within the viewport at the same time)
  // 3. which positions are currently compatible (allow both target & tooltip to fit with the CURRENT viewport)
  // 4. which of those positions is *best* - use same closest-to-center heuristic.
  // priority is 3 > 2 > 1 for the pool of positions from which 4 is chosen

  const viewportDims: Dims = getViewportDims(root);
  const viewportScrollStart: Coords = getViewportScrollStart(root);
  const viewportCurrentStart: Coords = getViewportStart(root);
  const viewportScrollEnd: Coords = getViewportScrollEnd(root);
  const tooltipDims: Dims = getElementDims(tooltip);
  const targetDims: Dims = getElementDims(target);
  const targetCoords: Coords = getElementCoords(target);
  const curriedGetCombinedData = (coords: Coords) => getCombinedData(coords, tooltipDims, targetCoords, targetDims);

  const validPositions: OrientationCoords[] = preferredCandidates.filter(
    getInBoundsFilter(tooltipDims, viewportScrollStart, viewportScrollEnd),
  );
  const absoluteCompatiblePositions: OrientationCoords[] = validPositions.filter(
    getAbsoluteCompatibleArrangementFilter(curriedGetCombinedData, viewportDims),
  );
  const currentCompatiblePositions: OrientationCoords[] = absoluteCompatiblePositions.filter(
    getCurrentInViewFilter(curriedGetCombinedData, viewportDims, viewportCurrentStart),
  );

  // // if possible, use only those positions which don't force a scroll. Default back to those which can fit in the viewport, even if that means scrolling
  const compatiblePositions: OrientationCoords[] =
    currentCompatiblePositions.length > 0 ? currentCompatiblePositions : absoluteCompatiblePositions;

  // Prefer any compatible placement. If none fit (tiny viewport / huge target),
  // fall back to CENTER rather than intentionally placing off-screen.
  if (compatiblePositions.length > 0) {
    return compatiblePositions.reduce(getCenterReducer(root, tooltip, target, true), undefined);
  }

  const filteredList = validPositions.length > 0 ? validPositions : preferredCandidates;
  const fallback = filteredList.reduce(getCenterReducer(root, tooltip, target, true), undefined);
  if (fallback) return fallback;

  // Last resort: center over the target so clamp can keep it on-screen.
  return {
    orientation: CardinalOrientation.CENTER,
    coords: {
      x: targetCoords.x + targetDims.width / 2 - tooltipDims.width / 2,
      y: targetCoords.y + targetDims.height / 2 - tooltipDims.height / 2,
    },
  };
}

/** Filter out positions where the tooltip is outside the scrollable root bounds. */
function getInBoundsFilter(
  tooltipDims: Dims,
  viewportScrollStart: Coords,
  viewportScrollEnd: Coords,
): (oc: OrientationCoords) => boolean {
  return (oc: OrientationCoords): boolean => {
    const coords: Coords = oc.coords;
    return !(
      coords.x < viewportScrollStart.x ||
      coords.y < viewportScrollStart.y ||
      coords.x + tooltipDims.width > viewportScrollEnd.x ||
      coords.y + tooltipDims.height > viewportScrollEnd.y
    );
  };
}

/** Filter out positions where target + tooltip cannot fit in the viewport together. */
function getAbsoluteCompatibleArrangementFilter(
  curriedGetCombinedData: (coords: Coords) => { dims: Dims; coords: Coords },
  viewportDims: Dims,
): (oc: OrientationCoords) => boolean {
  return (oc: OrientationCoords): boolean => {
    const coords: Coords = oc.coords;
    // we only care about the resultant dims but the input coords are critical here
    const { dims: combinedDims } = curriedGetCombinedData(coords);

    return fitsWithin(combinedDims, viewportDims);
  };
}

/** Filter to positions that fit within the current viewport without scrolling. */
function getCurrentInViewFilter(
  curriedGetCombinedData: (coords: Coords) => { dims: Dims; coords: Coords },
  viewportDims: Dims,
  viewportCurrentStart: Coords,
): (oc: OrientationCoords) => boolean {
  return (oc: OrientationCoords): boolean => {
    const coords: Coords = oc.coords;

    const { dims: combinedDims, coords: combinedCoords } = curriedGetCombinedData(coords);

    return isWithinAt(combinedDims, viewportDims, combinedCoords, viewportCurrentStart);
  };
}

/** Narrow candidates to those matching orientation preferences, if any. */
export function getPreferredCandidates(
  candidates: OrientationCoords[],
  orientationPreferences?: CardinalOrientation[],
): OrientationCoords[] {
  if (!orientationPreferences || orientationPreferences.length === 0) {
    return candidates;
  }
  // Always keep the full preference set for fit scoring — a single pinned
  // orientation that doesn't fit must still be able to fall back via chooseBest.
  const preferred = candidates.filter(
    (cc: OrientationCoords) => orientationPreferences.indexOf(cc.orientation) !== -1,
  );
  return preferred.length > 0 ? preferred : candidates;
}

/**
 * Clamp fixed/viewport coordinates so the tooltip stays inside the visible
 * viewport (getBoundingClientRect space). Uses visual viewport when available.
 */
export function restrictToCurrentViewport(root: Element, coords: Coords, dims: Dims, padding: number): Coords {
  if (!root || !coords) {
    return coords;
  }

  const inset = Math.max(0, padding);
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  const start = getViewportStart(root);
  const viewportDims = getViewportDims(root);

  // Prefer the on-screen visual viewport (mobile URL bar / keyboard).
  const originX = vv ? vv.offsetLeft : start.x;
  const originY = vv ? vv.offsetTop : start.y;
  const viewW = vv ? vv.width : viewportDims.width;
  const viewH = vv ? vv.height : viewportDims.height;

  const sx = originX + inset;
  const sy = originY + inset;
  const maxX = originX + viewW - inset;
  const maxY = originY + viewH - inset;

  const width = Math.max(0, dims?.width || 0);
  const height = Math.max(0, dims?.height || 0);

  // If the tooltip is wider/taller than the padded viewport, pin to the start edge.
  const ex = Math.max(sx, maxX - width);
  const ey = Math.max(sy, maxY - height);

  return {
    x: Math.min(Math.max(coords.x, sx), ex),
    y: Math.min(Math.max(coords.y, sy), ey),
  };
}
