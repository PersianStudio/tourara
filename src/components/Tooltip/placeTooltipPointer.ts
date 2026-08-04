/**
 * Precise tooltip → target pointer placement.
 *
 * Aims the caret tip at the nearest point on the padded focus rect
 * (target + maskPadding — the same hole the mask stroke follows).
 * Corner carets stay card-local (fixed length) so they never stretch
 * across the gutter or detach while the shell animates.
 */

import { CardinalOrientation } from '../../utils/positioning';

export type PointerSide =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type PointerPlacement = {
  side: PointerSide;
  /** Distance along the side from its start edge to the caret’s near corner. Unused for corners. */
  offset: number;
  /** Tip length — always ~tooltipSeparation for both edges and corners. */
  size: number;
  aimX: number;
  aimY: number;
  /**
   * Corner carets only: CSS degrees applied to a tip-up triangle so the tip
   * faces (aimX, aimY). 0 keeps the tip pointing up.
   */
  rotation?: number;
};

export type PlaceTooltipPointerArgs = {
  tooltipEl: HTMLElement;
  targetEl: HTMLElement;
  maskPadding?: number;
  arrowSize?: number;
  orientation?: CardinalOrientation | null;
  /**
   * Optional intended shell top-left (viewport coords). When set, placement
   * uses this box instead of a mid-transition getBoundingClientRect so the
   * caret stays locked to the card while CSS animates top/left.
   */
  intendedCoords?: { x: number; y: number } | null;
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

function isCornerSide(side: PointerSide): boolean {
  return side.includes('-');
}

function cornerPoint(tooltip: Rect, side: PointerSide): { x: number; y: number } {
  switch (side) {
    case 'top-left':
      return { x: tooltip.left, y: tooltip.top };
    case 'top-right':
      return { x: tooltip.right, y: tooltip.top };
    case 'bottom-left':
      return { x: tooltip.left, y: tooltip.bottom };
    case 'bottom-right':
      return { x: tooltip.right, y: tooltip.bottom };
    default:
      return { x: (tooltip.left + tooltip.right) / 2, y: (tooltip.top + tooltip.bottom) / 2 };
  }
}

/** Degrees to rotate a tip-up caret so its tip faces the aim point. */
function rotationToward(fromX: number, fromY: number, toX: number, toY: number): number {
  const angleRad = Math.atan2(toY - fromY, toX - fromX);
  // tip-up points at -90° in screen space; CSS rotate is clockwise-positive.
  return (angleRad * 180) / Math.PI + 90;
}

/**
 * Map placement orientation → which tooltip edge faces the target.
 * Used as a soft hint; geometry still drives aim offset along the edge.
 */
function sideFromOrientation(orientation: CardinalOrientation | null | undefined): PointerSide | null {
  switch (orientation) {
    case CardinalOrientation.NORTH:
      return 'bottom';
    case CardinalOrientation.NORTHEAST:
      return 'bottom-left';
    case CardinalOrientation.NORTHWEST:
      return 'bottom-right';
    case CardinalOrientation.SOUTH:
      return 'top';
    case CardinalOrientation.SOUTHEAST:
      return 'top-left';
    case CardinalOrientation.SOUTHWEST:
      return 'top-right';
    case CardinalOrientation.EAST:
      return 'left';
    case CardinalOrientation.EASTNORTH:
      return 'bottom-left';
    case CardinalOrientation.EASTSOUTH:
      return 'top-left';
    case CardinalOrientation.WEST:
      return 'right';
    case CardinalOrientation.WESTNORTH:
      return 'bottom-right';
    case CardinalOrientation.WESTSOUTH:
      return 'top-right';
    default:
      return null;
  }
}

/**
 * Pick an edge or corner from the vector between tooltip center and aim.
 * Diagonal when both axes are meaningful; otherwise a flat edge.
 */
function sideFromGeometry(tooltip: Rect, aimX: number, aimY: number): PointerSide {
  const cx = (tooltip.left + tooltip.right) / 2;
  const cy = (tooltip.top + tooltip.bottom) / 2;
  const dx = aimX - cx;
  const dy = aimY - cy;
  const nx = Math.abs(dx) / Math.max(tooltip.width, 1);
  const ny = Math.abs(dy) / Math.max(tooltip.height, 1);

  // Both axes matter → sit on the facing corner (e.g. focus NE → top-right).
  const DIAGONAL = 0.18;
  if (nx >= DIAGONAL && ny >= DIAGONAL) {
    const vertical = dy < 0 ? 'top' : 'bottom';
    const horizontal = dx > 0 ? 'right' : 'left';
    return `${vertical}-${horizontal}` as PointerSide;
  }

  if (nx > ny) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'bottom' : 'top';
}

/**
 * Place a caret on the tooltip edge/corner so its tip aims at the focus border.
 */
export function placeTooltipPointer(args: PlaceTooltipPointerArgs): PointerPlacement | null {
  const {
    tooltipEl,
    targetEl,
    maskPadding = 0,
    arrowSize = 10,
    orientation,
    intendedCoords,
  } = args;

  const live = toRect(tooltipEl.getBoundingClientRect());
  if (live.width <= 0 || live.height <= 0) return null;

  // Prefer the destination box while the shell CSS-transitions top/left.
  const tooltip: Rect =
    intendedCoords && Number.isFinite(intendedCoords.x) && Number.isFinite(intendedCoords.y)
      ? {
          left: intendedCoords.x,
          top: intendedCoords.y,
          width: live.width,
          height: live.height,
          right: intendedCoords.x + live.width,
          bottom: intendedCoords.y + live.height,
        }
      : live;

  const target = toRect(targetEl.getBoundingClientRect());
  if (target.width <= 0 || target.height <= 0) return null;

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

  const size = Math.max(6, arrowSize);
  const baseWidth = size * 2;
  const edgeInset = Math.min(12, Math.max(6, size));

  let offset = 0;
  let rotation: number | undefined;

  if (isCornerSide(side)) {
    const corner = cornerPoint(tooltip, side);
    rotation = rotationToward(corner.x, corner.y, aim.x, aim.y);
  } else if (side === 'top' || side === 'bottom') {
    const raw = aim.x - tooltip.left - size;
    const max = Math.max(edgeInset, tooltip.width - baseWidth - edgeInset);
    offset = Math.min(Math.max(raw, edgeInset), max);
  } else {
    const raw = aim.y - tooltip.top - size;
    const max = Math.max(edgeInset, tooltip.height - baseWidth - edgeInset);
    offset = Math.min(Math.max(raw, edgeInset), max);
  }

  if (!Number.isFinite(offset)) return null;
  if (rotation !== undefined && !Number.isFinite(rotation)) return null;

  return { side, offset, size, aimX: aim.x, aimY: aim.y, rotation };
}
