/**
 * Geometry-only tour layout (no listener teardown/rebuild).
 * Used for settle loops and resize/scroll updates so we do not thrash the DOM.
 */

import type React from 'react';
import type { TourOptions, TourProps, TourStep } from '../../types';
import { type Coords, type Dims, getElementDims as utilGetElementDims } from '../../utils/dom';
import {
  type OrientationCoords,
  getTargetPosition as utilGetTargetPosition,
  getTooltipPosition as utilGetTooltipPosition,
} from '../../utils/positioning';
import { resolveOrientationPreferences } from '../../utils/direction';
import { scrollTargetIntoView } from './scrollTargetIntoView';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTargetPosition = utilGetTargetPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTooltipPosition = utilGetTooltipPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getElementDims = utilGetElementDims as any;

const COORD_EPS = 0.5;

export interface ApplyTourGeometryArgs {
  options: TourOptions & TourProps & TourStep;
  tooltip: React.MutableRefObject<HTMLElement | undefined>;
  tourRoot: Element | undefined;
  setTooltipPosition: React.Dispatch<React.SetStateAction<OrientationCoords | undefined>>;
  currentStepIndex: number;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
  targetPosition: React.MutableRefObject<Coords | null>;
  targetSize: React.MutableRefObject<Dims | null>;
  lastScrollKey: React.MutableRefObject<string>;
  /** When false, skip scrollIntoView (settle frames after the first). */
  allowScroll?: boolean;
}

function sameCoords(a?: Coords | null, b?: Coords | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return Math.abs(a.x - b.x) < COORD_EPS && Math.abs(a.y - b.y) < COORD_EPS;
}

function sameOrientation(
  prev: OrientationCoords | undefined,
  next: OrientationCoords,
): boolean {
  return (
    prev?.orientation === next.orientation &&
    sameCoords(prev?.coords, next.coords)
  );
}

/**
 * Resolve target + tooltip placement and write React state only when values change.
 * Returns the current target element (if any).
 */
export function applyTourGeometry(args: ApplyTourGeometryArgs): HTMLElement | undefined {
  const {
    options,
    tooltip,
    tourRoot,
    setTooltipPosition,
    currentStepIndex,
    setTarget,
    targetPosition,
    targetSize,
    lastScrollKey,
    allowScroll = true,
  } = args;

  const {
    selector,
    maskPadding,
    tooltipSeparation,
    orientationPreferences,
    disableAutoScroll,
    getPositionFromCandidates,
    disableMask,
    disableSmoothScroll,
    allowForeignTarget,
    direction = 'ltr',
  } = options;

  const root = tourRoot;
  const tooltipContainer = tooltip.current;

  if (!root || !tooltipContainer) {
    setTarget((prev) => (prev ? undefined : prev));
    setTooltipPosition((prev) => (prev ? undefined : prev));
    return undefined;
  }

  const targetScope: Element | Document = allowForeignTarget ? document : root;
  const currentTarget =
    (targetScope.querySelector(selector) as HTMLElement | null) || undefined;

  if (currentTarget && allowScroll) {
    scrollTargetIntoView({
      el: currentTarget,
      scrollKey: `${currentStepIndex}:${selector}`,
      lastScrollKey,
      disableAutoScroll,
      disableSmoothScroll,
      allowForeignTarget,
      root,
      selector,
    });
  }

  const currentTargetPosition: Coords | undefined = getTargetPosition(root, currentTarget);
  const currentTargetDims: Dims | undefined = getElementDims(currentTarget);
  const smartPadding = disableMask ? 0 : maskPadding || 0;
  const resolvedPreferences = resolveOrientationPreferences(orientationPreferences, direction);

  const tooltipPosition: OrientationCoords = getTooltipPosition({
    target: currentTarget,
    tooltip: tooltipContainer,
    padding: smartPadding,
    tooltipSeparation,
    orientationPreferences: resolvedPreferences,
    root,
    getPositionFromCandidates,
    disableAutoScroll,
    allowForeignTarget,
    selector,
  });

  targetPosition.current = currentTargetPosition ?? null;
  targetSize.current = currentTargetDims ?? null;

  setTarget((prev) => (prev === currentTarget ? prev : currentTarget));
  setTooltipPosition((prev) => (sameOrientation(prev, tooltipPosition) ? prev : tooltipPosition));

  return currentTarget;
}
