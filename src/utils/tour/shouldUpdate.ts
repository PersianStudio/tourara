/**
 * Decides whether the tour overlay needs a re-layout: target moved/resized,
 * tooltip scrolled out of view, or center-position drifted when there is no target.
 */

//@ts-nocheck

import { Coords, Dims, areaDiff, dist, fitsWithin, getElementDims, isForeignTarget } from '../dom';
import { GetTooltipPositionArgs, OrientationCoords, getTargetPosition, getTooltipPosition } from '../positioning';
import { getViewportDims, isElementInView } from '../viewport';

interface NaiveShouldScrollArgs {
  root: Element;
  tooltip: HTMLElement;
  tooltipPosition: Coords;
  target: HTMLElement;
}

function naiveShouldScroll(args: NaiveShouldScrollArgs): boolean {
  const { root, tooltip, tooltipPosition, target } = args;

  if (!isElementInView(root, tooltip, tooltipPosition)) {
    return true;
  }

  if (!isElementInView(root, target)) {
    return fitsWithin(getElementDims(target), getViewportDims(root));
  }

  return false;
}
export interface ShouldScrollArgs extends NaiveShouldScrollArgs {
  disableAutoScroll?: boolean;
  allowForeignTarget?: boolean;
  selector?: string;
}

export function shouldScroll(args: ShouldScrollArgs): boolean {
  const { root, tooltip, target, disableAutoScroll, allowForeignTarget, selector: targetSelector } = args;
  if (!root || !tooltip || !target) {
    return false;
  }

  if (disableAutoScroll) {
    return false;
  }

  if (allowForeignTarget && targetSelector) {
    return !isForeignTarget(root, targetSelector);
  }
  return naiveShouldScroll({ ...args });
}

export interface TargetChangedArgs {
  root: Element;
  target: HTMLElement | undefined;
  targetCoords: Coords;
  targetDims: Dims;
  rerenderTolerance: number | undefined;
}
export function targetChanged(args: TargetChangedArgs): boolean {
  const { root, target, targetCoords, targetDims, rerenderTolerance } = args;
  if (!target && !targetCoords && !targetDims) {
    return false;
  }

  // when the target / target data are out of sync. usually due to a movingTarget, i.e. the target arg is more up to date than the pos/dims args
  if ((!target && targetCoords && targetDims) || (target && !targetCoords && !targetDims)) {
    return true;
  }

  const currentTargetSize: Dims = getElementDims(target);
  const currentTargetPosition: Coords = getTargetPosition(root, target);

  const sizeChanged: boolean = areaDiff(currentTargetSize, targetDims) > rerenderTolerance;
  const positionChanged: boolean = dist(currentTargetPosition, targetCoords) > rerenderTolerance;

  return sizeChanged || positionChanged;
}

export interface TooltipDesyncArgs extends GetTooltipPositionArgs {
  tooltipPosition: Coords;
}

// if there's no target, we need to ensure that the tooltip is centered, even if the window/container/scroll changes
// if a target exists, there's not a tooltip desync in this context; there are two other functions
// to determine if the tooltip/target are out of sync - this is solely for non-target cases
export function tooltipDesync(args: TooltipDesyncArgs): boolean {
  const { target, root, tooltip, tooltipPosition: currentPosition } = args;
  if (target || !root || !tooltip) {
    return false;
  }

  const newPosition: OrientationCoords = getTooltipPosition({ ...args });

  // if there's a difference between the newly calculated position and the current position, we need to update
  return dist(newPosition.coords, currentPosition) !== 0;
}

export interface ShouldUpdateArgs extends TargetChangedArgs, ShouldScrollArgs, TooltipDesyncArgs {}

export function shouldUpdate(args: ShouldUpdateArgs): boolean {
  const { root, tooltip } = args;
  if (!root || !tooltip) {
    return false; // bail if these aren't present; need them for calculations
  }

  return targetChanged({ ...args }) || shouldScroll({ ...args }) || tooltipDesync({ ...args });
}
