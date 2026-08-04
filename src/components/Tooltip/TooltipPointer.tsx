/**
 * Geometry-aligned caret that points from the tooltip at the focus border.
 * Edge carets use CSS border triangles; corner carets use the same triangle
 * rotated and translated so the tip lands on the aim point.
 */
import type { CSSProperties } from 'react';
import type { PointerPlacement, PointerSide } from './placeTooltipPointer';

export type TooltipPointerProps = {
  placement: PointerPlacement;
};

function isCornerSide(side: PointerSide): boolean {
  return side.includes('-');
}

/** Fallback when rotation is missing — tip faces the named corner direction. */
function defaultCornerRotation(side: PointerSide): number {
  switch (side) {
    case 'top-right':
      return 45;
    case 'top-left':
      return -45;
    case 'bottom-right':
      return 135;
    case 'bottom-left':
      return -135;
    default:
      return 0;
  }
}

/** Pin the tip-up triangle’s tip origin to the card corner. */
function cornerAnchor(side: PointerSide, overlap: number): CSSProperties {
  switch (side) {
    case 'top-right':
      return { top: -overlap, right: 0 };
    case 'top-left':
      return { top: -overlap, left: 0 };
    case 'bottom-right':
      return { top: 'auto', bottom: -overlap, right: 0 };
    case 'bottom-left':
      return { top: 'auto', bottom: -overlap, left: 0 };
    default:
      return {};
  }
}

function caretStyle(placement: PointerPlacement): CSSProperties {
  const { side, offset, size, base, rotation } = placement;
  const color = 'var(--tourara-bg)';
  const transparent = 'transparent';
  const halfBase = base ?? size;

  // 1px overlap removes the sub-pixel gap against the rounded card edge.
  const overlap = 1;

  const common: CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 10002,
    pointerEvents: 'none',
    boxSizing: 'border-box',
  };

  // Tip-up triangle: length = size, base width = 2 * halfBase.
  const tipUp: CSSProperties = {
    ...common,
    borderLeft: `${halfBase}px solid ${transparent}`,
    borderRight: `${halfBase}px solid ${transparent}`,
    borderBottom: `${size}px solid ${color}`,
  };

  if (isCornerSide(side)) {
    const deg = rotation ?? defaultCornerRotation(side);
    // rotation = atan2(dy,dx)*180/PI + 90  →  aim angle = deg - 90
    const aimRad = ((deg - 90) * Math.PI) / 180;
    const tx = Math.cos(aimRad) * size;
    const ty = Math.sin(aimRad) * size;

    return {
      ...tipUp,
      ...cornerAnchor(side, overlap),
      // Rotate around the tip, then push the tip out to the focus border.
      // CSS applies right-to-left: rotate first, then translate in screen space.
      transform: `translate(${tx}px, ${ty}px) rotate(${deg}deg)`,
      transformOrigin: '0 0',
    };
  }

  switch (side) {
    case 'top':
      return {
        ...tipUp,
        top: -(size - overlap),
        left: offset,
      };
    case 'bottom':
      return {
        ...common,
        bottom: -(size - overlap),
        left: offset,
        borderLeft: `${halfBase}px solid ${transparent}`,
        borderRight: `${halfBase}px solid ${transparent}`,
        borderTop: `${size}px solid ${color}`,
      };
    case 'left':
      return {
        ...common,
        left: -(size - overlap),
        top: offset,
        borderTop: `${halfBase}px solid ${transparent}`,
        borderBottom: `${halfBase}px solid ${transparent}`,
        borderRight: `${size}px solid ${color}`,
      };
    case 'right':
      return {
        ...common,
        right: -(size - overlap),
        top: offset,
        borderTop: `${halfBase}px solid ${transparent}`,
        borderBottom: `${halfBase}px solid ${transparent}`,
        borderLeft: `${size}px solid ${color}`,
      };
    default:
      return common;
  }
}

export function TooltipPointer({ placement }: TooltipPointerProps) {
  return (
    <div
      className={`tourara-tooltip-pointer tourara-tooltip-pointer--${placement.side}`}
      style={caretStyle(placement)}
      aria-hidden
    />
  );
}
