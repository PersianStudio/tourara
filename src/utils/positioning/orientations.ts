/**
 * Cardinal orientations and shared types for tooltip placement.
 */

import type { Coords } from '../dom';

export enum CardinalOrientation {
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
  NORTH = 'north',
  CENTER = 'center',
  EASTNORTH = 'east-north',
  EASTSOUTH = 'east-south',
  SOUTHEAST = 'south-east',
  SOUTHWEST = 'south-west',
  WESTSOUTH = 'west-south',
  WESTNORTH = 'west-north',
  NORTHWEST = 'north-west',
  NORTHEAST = 'north-east',
}

/** A candidate placement: orientation label plus viewport coordinates. */
export interface OrientationCoords {
  orientation: CardinalOrientation;
  coords: Coords;
}

/** Arguments for computing the tooltip's position relative to its target. */
export interface GetTooltipPositionArgs {
  target: HTMLElement;
  tooltip: HTMLElement;
  padding: number;
  tooltipSeparation: number;
  root: Element;
  orientationPreferences?: CardinalOrientation[];
  getPositionFromCandidates?: (candidates: OrientationCoords[]) => OrientationCoords;
  disableAutoScroll?: boolean;
  allowForeignTarget?: boolean;
  selector?: string;
  isPreferredCandidatesIncluded?: boolean;
}
