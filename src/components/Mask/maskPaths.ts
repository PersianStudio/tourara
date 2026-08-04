/**
 * SVG path builders for the tour mask: viewport cutout around the target
 * and optional border stroke along that cutout.
 */
import type { Coords, Dims } from '../../utils/dom';

export interface CutoutTarget {
  coords: Coords;
  dims: Dims;
}

/**
 * Build an SVG path that fills the viewport and punches a rectangular (optionally
 * rounded) hole around the target. Used as a clipPath so the dimming rect only
 * covers everything outside the highlighted element.
 *
 * The path walks the outer bounds, then traces the cutout clockwise/counter
 * so the winding rule creates a hole.
 */
export function getCutoutPath(
  target: CutoutTarget | undefined,
  options: { padding: number; radius: number; containerWidth: number; containerHeight: number },
): string {
  if (!target) {
    return '';
  }

  const { dims, coords } = target;
  const { padding, radius, containerWidth, containerHeight } = options;

  const cutoutTop: number = coords.y - padding;
  const cutoutLeft: number = coords.x - padding;
  const cutoutRight: number = coords.x + dims.width + padding;
  const cutoutBottom: number = coords.y + dims.height + padding;

  if (radius > 0) {
    // Outer rectangle + rounded cutout via quadratic corner arcs.
    return `M 0, 0
              L 0, ${containerHeight}
              L ${cutoutLeft}, ${containerHeight}
              L ${cutoutLeft}, ${cutoutTop + radius}
              Q ${cutoutLeft}, ${cutoutTop}, ${cutoutLeft + radius}, ${cutoutTop}
              L ${cutoutRight - radius}, ${cutoutTop}
              Q ${cutoutRight}, ${cutoutTop}, ${cutoutRight}, ${cutoutTop + radius}
              L ${cutoutRight}, ${cutoutBottom - radius}
              Q ${cutoutRight}, ${cutoutBottom}, ${cutoutRight - radius}, ${cutoutBottom}
              L ${cutoutLeft + radius}, ${cutoutBottom}
              Q ${cutoutLeft}, ${cutoutBottom}, ${cutoutLeft}, ${cutoutBottom - radius}
              L ${cutoutLeft}, ${containerHeight}
              L ${containerWidth}, ${containerHeight}
              L ${containerWidth}, 0`;
  }

  // Sharp-corner cutout (no radius).
  return `M 0, 0
            L 0, ${containerHeight}
            L ${cutoutLeft}, ${containerHeight}
            L ${cutoutLeft}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutBottom}
            L ${cutoutLeft}, ${cutoutBottom}
            L ${cutoutLeft}, ${containerHeight}
            L ${containerWidth}, ${containerHeight}
            L ${containerWidth}, 0`;
}

/**
 * Build a closed SVG path that outlines only the cutout border (stroke, no fill).
 * Matches the same padded/rounded geometry as getCutoutPath.
 */
export function getBorderPath(
  target: CutoutTarget | undefined,
  options: { padding: number; radius: number },
): string {
  if (!target) return '';

  const { dims, coords } = target;
  const { padding, radius } = options;

  const cutoutTop = coords.y - padding;
  const cutoutLeft = coords.x - padding;
  const cutoutRight = coords.x + dims.width + padding;
  const cutoutBottom = coords.y + dims.height + padding;

  if (radius > 0) {
    return `M ${cutoutLeft + radius}, ${cutoutTop}
              L ${cutoutRight - radius}, ${cutoutTop}
              Q ${cutoutRight}, ${cutoutTop}, ${cutoutRight}, ${cutoutTop + radius}
              L ${cutoutRight}, ${cutoutBottom - radius}
              Q ${cutoutRight}, ${cutoutBottom}, ${cutoutRight - radius}, ${cutoutBottom}
              L ${cutoutLeft + radius}, ${cutoutBottom}
              Q ${cutoutLeft}, ${cutoutBottom}, ${cutoutLeft}, ${cutoutBottom - radius}
              L ${cutoutLeft}, ${cutoutTop + radius}
              Q ${cutoutLeft}, ${cutoutTop}, ${cutoutLeft + radius}, ${cutoutTop}`;
  }

  return `M ${cutoutLeft}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutBottom}
            L ${cutoutLeft}, ${cutoutBottom}
            Z`;
}
