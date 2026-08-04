/**
 * Geometry-aligned caret that points from the tooltip at the focus border.
 * Built with CSS borders so each side’s tip faces outward exactly.
 */
import type { CSSProperties } from 'react';
import type { PointerPlacement, PointerSide } from './placeTooltipPointer';

export type TooltipPointerProps = {
  placement: PointerPlacement;
};

function caretStyle(side: PointerSide, offset: number, size: number): CSSProperties {
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

  switch (side) {
    case 'top':
      // Tip points up (target is above the tooltip).
      return {
        ...common,
        top: -(size - overlap),
        left: offset,
        borderLeft: `${size}px solid ${transparent}`,
        borderRight: `${size}px solid ${transparent}`,
        borderBottom: `${size}px solid ${color}`,
      };
    case 'bottom':
      // Tip points down.
      return {
        ...common,
        bottom: -(size - overlap),
        left: offset,
        borderLeft: `${size}px solid ${transparent}`,
        borderRight: `${size}px solid ${transparent}`,
        borderTop: `${size}px solid ${color}`,
      };
    case 'left':
      // Tip points left.
      return {
        ...common,
        left: -(size - overlap),
        top: offset,
        borderTop: `${size}px solid ${transparent}`,
        borderBottom: `${size}px solid ${transparent}`,
        borderRight: `${size}px solid ${color}`,
      };
    case 'right':
      // Tip points right.
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
  const { side, offset, size } = placement;

  return (
    <div
      className={`tourara-tooltip-pointer tourara-tooltip-pointer--${side}`}
      style={caretStyle(side, offset, size)}
      aria-hidden
    />
  );
}
