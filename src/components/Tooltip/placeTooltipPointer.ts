/**
 * Precise tooltip → target pointer placement.
 *
 * Aims the caret tip at the nearest point on the padded focus rect
 * (target + maskPadding — the same hole the mask stroke follows).
 */

import { CardinalOrientation } from '../../utils/positioning';

export type PointerSide = 'top' | 'right' | 'bottom' | 'left';

export type PointerPlacement = {
  side: PointerSide;
  /** Distance along the side from its start edge to the caret’s near corner. */
  offset: number;
  size: number;
  aimX: number;
  aimY: number;
};

export type PlaceTooltipPointerArgs = {
  tooltipEl: HTMLElement;
  targetEl: HTMLElement;
  maskPadding?: number;
  arrowSize?: number;
  orientation?: CardinalOrientation | null;
};

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };

function toRect(r: DOMRect): Rect {
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
}

function inflate(rect: Rect, pad: number): Rect {
  return {
    left: rect.left - pad,
    top: rect.top - pad,
    right: rect.right + pad,
    bottom: rect.bottom + pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

function closestPointOnRect(px: number, py: number, rect: Rect): { x: number; y: number } {
  return {
    x: Math.min(Math.max(px, rect.left), rect.right),
    y: Math.min(Math.max(py, rect.top), rect.bottom),
  };
}

/**
 * Map placement orientation → which tooltip edge faces the target.
 * Used as a soft hint; geometry still drives aim offset along the edge.
 */
function sideFromOrientation(orientation: CardinalOrientation | null | undefined): PointerSide | null {
  switch (orientation) {
    case CardinalOrientation.NORTH:
    case CardinalOrientation.NORTHEAST:
    case CardinalOrientation.NORTHWEST:
      return 'bottom';
    case CardinalOrientation.SOUTH:
    case CardinalOrientation.SOUTHEAST:
    case CardinalOrientation.SOUTHWEST:
      return 'top';
    case CardinalOrientation.EAST:
    case CardinalOrientation.EASTNORTH:
    case CardinalOrientation.EASTSOUTH:
      return 'left';
    case CardinalOrientation.WEST:
    case CardinalOrientation.WESTNORTH:
    case CardinalOrientation.WESTSOUTH:
      return 'right';
    default:
      return null;
  }
}

function sideFromGeometry(tooltip: Rect, aimX: number, aimY: number): PointerSide {
  const cx = (tooltip.left + tooltip.right) / 2;
  const cy = (tooltip.top + tooltip.bottom) / 2;
  const dx = aimX - cx;
  const dy = aimY - cy;
  const nx = Math.abs(dx) / Math.max(tooltip.width, 1);
  const ny = Math.abs(dy) / Math.max(tooltip.height, 1);
  if (nx > ny) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'bottom' : 'top';
}

/**
 * Place a caret on the tooltip edge so its tip aims at the focus border.
 */
export function placeTooltipPointer(args: PlaceTooltipPointerArgs): PointerPlacement | null {
  const {
    tooltipEl,
    targetEl,
    maskPadding = 0,
    arrowSize = 10,
    orientation,
  } = args;

  const tooltip = toRect(tooltipEl.getBoundingClientRect());
  const target = toRect(targetEl.getBoundingClientRect());
  if (tooltip.width <= 0 || tooltip.height <= 0 || target.width <= 0 || target.height <= 0) {
    return null;
  }

  const focus = inflate(target, Math.max(0, maskPadding));
  const cx = (tooltip.left + tooltip.right) / 2;
  const cy = (tooltip.top + tooltip.bottom) / 2;

  // Aim at the nearest point on the spotlight border (matches the mask stroke).
  const aim = closestPointOnRect(cx, cy, focus);

  // Geometry first for precision; orientation only when the vector is ambiguous.
  const geometric = sideFromGeometry(tooltip, aim.x, aim.y);
  const oriented = sideFromOrientation(orientation);
  const ambiguous =
    Math.abs(aim.x - cx) / Math.max(tooltip.width, 1) < 0.15 &&
    Math.abs(aim.y - cy) / Math.max(tooltip.height, 1) < 0.15;
  const side = ambiguous && oriented ? oriented : geometric;

  const baseWidth = arrowSize * 2;
  const edgeInset = Math.min(12, Math.max(6, arrowSize));

  let offset: number;
  if (side === 'top' || side === 'bottom') {
    const raw = aim.x - tooltip.left - arrowSize;
    const max = Math.max(edgeInset, tooltip.width - baseWidth - edgeInset);
    offset = Math.min(Math.max(raw, edgeInset), max);
  } else {
    const raw = aim.y - tooltip.top - arrowSize;
    const max = Math.max(edgeInset, tooltip.height - baseWidth - edgeInset);
    offset = Math.min(Math.max(raw, edgeInset), max);
  }

  if (!Number.isFinite(offset)) return null;

  return { side, offset, size: arrowSize, aimX: aim.x, aimY: aim.y };
}
