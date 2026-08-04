// cornerStyles.ts
//@ts-nocheck

import { CardinalOrientation } from './positioning';

/**
 * Returns an object with borderRadius and transform settings
 * based on the current orientation.
 */
export function getCornerStyles(orientation?: CardinalOrientation) {
  // Default: all corners rounded, no corner acts as a pointer,
  // and no rotation for "center" or undefined orientation.
  const style: React.CSSProperties = {};

  // If orientation is missing or "center", we keep the default (all rounded).
  if (!orientation || orientation === CardinalOrientation.CENTER) {
    return style;
  }

  // For each case, we set one corner to zero radius,
  // adjust transformOrigin to that corner,
  // and rotate by 45deg so that corner points at the target.
  switch (orientation) {
    // For orientation = 'east' => bottom-right corner is pointer
    case CardinalOrientation.EAST:
      style.borderBottomRightRadius = '0px';
      break;

    // For orientation = 'south' => top-left corner is pointer
    case CardinalOrientation.SOUTH:
      style.borderTopLeftRadius = '0px';

      break;

    // For orientation = 'west' => bottom-left corner is pointer
    case CardinalOrientation.WEST:
      style.borderBottomRightRadius = '0px';

      break;

    // For orientation = 'north' => bottom-right corner is pointer
    case CardinalOrientation.NORTH:
      style.borderBottomRightRadius = '0px';
      break;

    // If orientation = 'east-north' => bottom-right corner is pointer
    case CardinalOrientation.EASTNORTH:
      style.borderBottomLeftRadius = '0px';
      break;

    // If orientation = 'east-south' => top-right corner is pointer
    case CardinalOrientation.EASTSOUTH:
      style.borderTopLeftRadius = '0px';
      break;

    // If orientation = 'south-east' => top-left corner is pointer
    case CardinalOrientation.SOUTHEAST:
      style.borderTopLeftRadius = '0px';
      break;

    // If orientation = 'south-west' => bottom-left corner is pointer
    case CardinalOrientation.SOUTHWEST:
      style.borderTopRightRadius = '0px';
      break;

    // If orientation = 'west-south' => top-right corner is pointer
    case CardinalOrientation.WESTSOUTH:
      style.borderTopRightRadius = '0px';
      break;

    // If orientation = 'west-north' => bottom-right corner is pointer
    case CardinalOrientation.WESTNORTH:
      style.borderBottomRightRadius = '0px';
      break;

    // If orientation = 'north-west' => bottom-left corner is pointer
    case CardinalOrientation.NORTHWEST:
      style.borderBottomRightRadius = '0px';
      break;

    // If orientation = 'north-east' => top-right corner is pointer
    case CardinalOrientation.NORTHEAST:
      style.borderTopLeftRadius = '0px';
      break;

    default:
      // If we missed something, we stick with the default (all corners rounded).
      break;
  }

  return style;
}
