/**
 * LTR/RTL helpers for mirroring and resolving tooltip orientation preferences.
 */

import { CardinalOrientation } from './positioning';

export type TourDirection = 'ltr' | 'rtl';

/** Mirror horizontal orientations for RTL layouts. North/south stay the same. */
export function mirrorOrientation(orientation: CardinalOrientation): CardinalOrientation {
  switch (orientation) {
    case CardinalOrientation.EAST:
      return CardinalOrientation.WEST;
    case CardinalOrientation.WEST:
      return CardinalOrientation.EAST;
    case CardinalOrientation.EASTNORTH:
      return CardinalOrientation.WESTNORTH;
    case CardinalOrientation.EASTSOUTH:
      return CardinalOrientation.WESTSOUTH;
    case CardinalOrientation.WESTNORTH:
      return CardinalOrientation.EASTNORTH;
    case CardinalOrientation.WESTSOUTH:
      return CardinalOrientation.EASTSOUTH;
    case CardinalOrientation.NORTHEAST:
      return CardinalOrientation.NORTHWEST;
    case CardinalOrientation.NORTHWEST:
      return CardinalOrientation.NORTHEAST;
    case CardinalOrientation.SOUTHEAST:
      return CardinalOrientation.SOUTHWEST;
    case CardinalOrientation.SOUTHWEST:
      return CardinalOrientation.SOUTHEAST;
    default:
      return orientation;
  }
}

export function resolveOrientationPreferences(
  preferences: CardinalOrientation[] | undefined,
  direction: TourDirection = 'ltr',
): CardinalOrientation[] | undefined {
  if (!preferences?.length || direction === 'ltr') return preferences;
  return preferences.map(mirrorOrientation);
}

/** Default tip side: start-adjacent (east in LTR, west in RTL). */
export function defaultTipOrientations(direction: TourDirection = 'ltr'): CardinalOrientation[] {
  const start = direction === 'rtl' ? CardinalOrientation.WEST : CardinalOrientation.EAST;
  const end = direction === 'rtl' ? CardinalOrientation.EAST : CardinalOrientation.WEST;
  return [
    start,
    CardinalOrientation.SOUTH,
    end,
    CardinalOrientation.NORTH,
    direction === 'rtl' ? CardinalOrientation.SOUTHWEST : CardinalOrientation.SOUTHEAST,
    direction === 'rtl' ? CardinalOrientation.NORTHWEST : CardinalOrientation.NORTHEAST,
    direction === 'rtl' ? CardinalOrientation.SOUTHEAST : CardinalOrientation.SOUTHWEST,
    direction === 'rtl' ? CardinalOrientation.NORTHEAST : CardinalOrientation.NORTHWEST,
  ];
}
