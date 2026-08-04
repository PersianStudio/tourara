/**
 * Places the inactive tip marker beside a target using preferred orientations,
 * clamping into the viewport when no candidate fits.
 */
import { CardinalOrientation } from '../../utils/positioning';
import { TIP_GAP, TIP_SIZE } from './constants';

/**
 * Compute a fixed (viewport) position for a tip marker beside `target`.
 *
 * Tries each preferred orientation in order and returns the first that fits
 * inside the viewport (with a small inset). If none fit, clamps to the
 * east/west side implied by the first preference.
 */
export function placeTipMarker(
  target: HTMLElement,
  preferences: CardinalOrientation[],
): { x: number; y: number; orientation: CardinalOrientation } | null {
  const rect = target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  // Map each preferred orientation to a candidate top-left corner.
  const candidates: Array<{ orientation: CardinalOrientation; x: number; y: number }> = preferences.map(
    (orientation) => {
      switch (orientation) {
        case CardinalOrientation.EAST:
          return {
            orientation,
            x: rect.right + TIP_GAP,
            y: rect.top + rect.height / 2 - TIP_SIZE / 2,
          };
        case CardinalOrientation.WEST:
          return {
            orientation,
            x: rect.left - TIP_GAP - TIP_SIZE,
            y: rect.top + rect.height / 2 - TIP_SIZE / 2,
          };
        case CardinalOrientation.SOUTH:
          return {
            orientation,
            x: rect.left + rect.width / 2 - TIP_SIZE / 2,
            y: rect.bottom + TIP_GAP,
          };
        case CardinalOrientation.NORTH:
          return {
            orientation,
            x: rect.left + rect.width / 2 - TIP_SIZE / 2,
            y: rect.top - TIP_GAP - TIP_SIZE,
          };
        case CardinalOrientation.SOUTHEAST:
        case CardinalOrientation.EASTSOUTH:
          return { orientation, x: rect.right + TIP_GAP, y: rect.bottom - TIP_SIZE };
        case CardinalOrientation.NORTHEAST:
        case CardinalOrientation.EASTNORTH:
          return { orientation, x: rect.right + TIP_GAP, y: rect.top };
        case CardinalOrientation.SOUTHWEST:
        case CardinalOrientation.WESTSOUTH:
          return { orientation, x: rect.left - TIP_GAP - TIP_SIZE, y: rect.bottom - TIP_SIZE };
        case CardinalOrientation.NORTHWEST:
        case CardinalOrientation.WESTNORTH:
          return { orientation, x: rect.left - TIP_GAP - TIP_SIZE, y: rect.top };
        case CardinalOrientation.CENTER:
        default:
          // Default to east of the target when orientation is unknown/center.
          return {
            orientation: CardinalOrientation.EAST,
            x: rect.right + TIP_GAP,
            y: rect.top + rect.height / 2 - TIP_SIZE / 2,
          };
      }
    },
  );

  // Keep a 4px inset so the marker doesn't hug the viewport edge.
  const fits = (x: number, y: number) =>
    x >= 4 && y >= 4 && x + TIP_SIZE <= window.innerWidth - 4 && y + TIP_SIZE <= window.innerHeight - 4;

  for (const c of candidates) {
    if (fits(c.x, c.y)) return c;
  }

  // No preference fit — clamp to the primary side (west if preferred, else east).
  const fallbackSide = preferences[0] === CardinalOrientation.WEST ? 'west' : 'east';
  return {
    orientation: fallbackSide === 'west' ? CardinalOrientation.WEST : CardinalOrientation.EAST,
    x:
      fallbackSide === 'west'
        ? Math.max(4, rect.left - TIP_GAP - TIP_SIZE)
        : Math.min(Math.max(4, rect.right + TIP_GAP), window.innerWidth - TIP_SIZE - 4),
    y: Math.min(Math.max(4, rect.top + rect.height / 2 - TIP_SIZE / 2), window.innerHeight - TIP_SIZE - 4),
  };
}
