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
  getCurrentScrollOffset,
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
  if (preferredCandidates.length === 1) {
    //if there's only a single pref candidate, use that
    return preferredCandidates[0];
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

  // if there are NO compatible positions, the viewport is too small to accomodate both the target/tooltip, in any arrangement.
  // we default to our valid positions, even if that means placing the elements slightly off screen.
  const filteredList = compatiblePositions.length > 0 ? compatiblePositions : validPositions;

  return filteredList.reduce(getCenterReducer(root, tooltip, target, true), undefined);
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
  if (orientationPreferences.length === 1) {
    const specifiedCandidate = candidates.find((oc: OrientationCoords) => oc.orientation === orientationPreferences[0]);
    if (specifiedCandidate) {
      return [specifiedCandidate];
    }
    return candidates; // if the specified orientation isn't available for whatever reason, default to standard behavior
  }
  const preferenceFilter = (cc: OrientationCoords) => orientationPreferences.indexOf(cc.orientation) !== -1;
  return candidates.filter(preferenceFilter);
}

/** Clamp coordinates so the element stays fully inside the current viewport (with padding). */
export function restrictToCurrentViewport(root: Element, coords: Coords, dims: Dims, padding: number): Coords {
  if (!root) {
    return coords;
  }

  const viewportStart: Coords = getCurrentScrollOffset(root);
  const viewportDims: Dims = getViewportDims(root);
  const viewportEnd: Coords = {
    x: viewportStart.x + viewportDims.width,
    y: viewportStart.y + viewportDims.height,
  };
  const sx = viewportStart.x + padding;
  const sy = viewportStart.y + padding;
  const ex = viewportEnd.x - dims.width - padding;
  const ey = viewportEnd.y - dims.height - padding;

  let x: number = coords.x;
  let y: number = coords.y;

  if (coords.x < sx) {
    x = sx;
  } else if (coords.x + dims.width > ex) {
    x = ex;
  }

  if (coords.y < sy) {
    y = sy;
  } else if (coords.y + dims.height > ey) {
    y = ey;
  }

  return { x, y };
}
