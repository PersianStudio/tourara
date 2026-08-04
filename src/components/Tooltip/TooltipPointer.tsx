/**
 * Geometry-aligned caret that points from the tooltip at the focus border.
 * Edge + corner carets share the same CSS border triangle. Corner carets rotate
 * at the card corner and nudge outward by one caret length — never across the
 * full gutter — so they stay attached while the shell transitions.
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

function caretStyle(placement: PointerPlacement): CSSProperties {
  const { side, offset, size, rotation } = placement;
  const color = 'var(--tourara-bg)';
  const transparent = 'transparent';

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

  // Tip-up isosceles — same geometry as the edge “top” caret.
  const tipUp: CSSProperties = {
    ...common,
    borderLeft: `${size}px solid ${transparent}`,
    borderRight: `${size}px solid ${transparent}`,
    borderBottom: `${size}px solid ${color}`,
  };

  if (isCornerSide(side)) {
    const deg = rotation ?? defaultCornerRotation(side);
    // Aim angle from tip-up rotation convention (rotation = aimDeg + 90).
    const aimRad = ((deg - 90) * Math.PI) / 180;
    // Nudge tip one caret length outward — matches edge protrusion, stays
    // card-local (size is tooltipSeparation, not distance-to-focus).
    const tx = Math.cos(aimRad) * size;
    const ty = Math.sin(aimRad) * size;

    const anchor: CSSProperties =
      side === 'top-right'
        ? { top: 0, right: 0 }
        : side === 'top-left'
          ? { top: 0, left: 0 }
          : side === 'bottom-right'
            ? { top: 'auto', bottom: 0, right: 0 }
            : { top: 'auto', bottom: 0, left: 0 };

    return {
      ...tipUp,
      ...anchor,
      // rotate around tip, then push tip outward along the aim vector
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
        borderLeft: `${size}px solid ${transparent}`,
        borderRight: `${size}px solid ${transparent}`,
        borderTop: `${size}px solid ${color}`,
      };
    case 'left':
      return {
        ...common,
        left: -(size - overlap),
        top: offset,
        borderTop: `${size}px solid ${transparent}`,
        borderBottom: `${size}px solid ${transparent}`,
        borderRight: `${size}px solid ${color}`,
      };
    case 'right':
      return {
        ...common,
        right: -(size - overlap),
        top: offset,
        borderTop: `${size}px solid ${transparent}`,
        borderBottom: `${size}px solid ${transparent}`,
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
