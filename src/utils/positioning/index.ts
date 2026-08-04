/**
 * Tooltip / target positioning for the tour overlay.
 *
 * Re-exports the public API previously provided by `utils/positioning.ts`.
 */

export {
  CardinalOrientation,
  type OrientationCoords,
  type GetTooltipPositionArgs,
} from './orientations';

export { getTooltipPosition, getTargetPosition } from './getTooltipPosition';
