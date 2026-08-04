//@ts-nocheck

/**
 * Builds the set of candidate tooltip positions around a target element.
 */

import {
  Coords,
  Dims,
  getElementCoords,
  getElementDims,
} from '../dom';
import { applyCenterOffset } from '../offset';
import { CardinalOrientation, OrientationCoords } from './orientations';

/**
 * Returns candidate placements (preferred corners, cardinal sides, aligned
 * variants, and center) for the tooltip relative to the target.
 */
export function getTooltipPositionCandidates(
  target: HTMLElement,
  tooltip: HTMLElement,
  padding: number,
  tooltipDistance: number,
  includeAllPositions = true,
  isPreferredCandidatesIncluded = true,
): OrientationCoords[] {
  if (!target || !tooltip) {
    return;
  }

  const tooltipDims: Dims = getElementDims(tooltip);
  const targetCoords: Coords = getElementCoords(target);
  const targetDims: Dims = getElementDims(target);
  const centerX: number = targetCoords.x - (tooltipDims.width - targetDims.width) / 2;
  const centerY: number = targetCoords.y - (tooltipDims.height - targetDims.height) / 2;
  const eastOffset: number = targetCoords.x + targetDims.width + padding + tooltipDistance;
  const southOffset: number = targetCoords.y + targetDims.height + padding + tooltipDistance;
  const westOffset: number = targetCoords.x - tooltipDims.width - padding - tooltipDistance;
  const northOffset: number = targetCoords.y - tooltipDims.height - padding - tooltipDistance;

  let preferredCandidates: OrientationCoords[] = [];

  if (isPreferredCandidatesIncluded) {
    // Calculate corner positions
    const topLeft: Coords = {
      x: targetCoords.x - tooltipDims.width - padding - tooltipDistance,
      y: targetCoords.y - tooltipDims.height - padding - tooltipDistance,
    };

    const topRight: Coords = {
      x: targetCoords.x + targetDims.width + padding + tooltipDistance,
      y: targetCoords.y - tooltipDims.height - padding - tooltipDistance,
    };

    const bottomLeft: Coords = {
      x: targetCoords.x - tooltipDims.width - padding - tooltipDistance,
      y: targetCoords.y + targetDims.height + padding + tooltipDistance,
    };

    const bottomRight: Coords = {
      x: targetCoords.x + targetDims.width + padding + tooltipDistance,
      y: targetCoords.y + targetDims.height + padding + tooltipDistance,
    };

    preferredCandidates = [
      { orientation: CardinalOrientation.NORTHWEST, coords: topLeft },
      { orientation: CardinalOrientation.NORTHEAST, coords: topRight },
      { orientation: CardinalOrientation.SOUTHWEST, coords: bottomLeft },
      { orientation: CardinalOrientation.SOUTHEAST, coords: bottomRight },
    ];
  }

  const east: Coords = { x: eastOffset, y: centerY };
  const south: Coords = { x: centerX, y: southOffset };
  const west: Coords = { x: westOffset, y: centerY };
  const north: Coords = { x: centerX, y: northOffset };
  const center: Coords = applyCenterOffset(targetCoords, targetDims, tooltipDims);

  const standardPositions = [
    { orientation: CardinalOrientation.EAST, coords: east },
    { orientation: CardinalOrientation.SOUTH, coords: south },
    { orientation: CardinalOrientation.WEST, coords: west },
    { orientation: CardinalOrientation.NORTH, coords: north },
  ];

  let additionalPositions: OrientationCoords[] = [];
  if (includeAllPositions) {
    const eastAlign: number = targetCoords.x - (tooltipDims.width - targetDims.width) + padding;
    const southAlign: number = targetCoords.y - (tooltipDims.height - targetDims.height) + padding;
    const westAlign: number = targetCoords.x - padding;
    const northAlign: number = targetCoords.y - padding;

    const eastNorth: Coords = { x: eastOffset, y: northAlign };
    const eastSouth: Coords = { x: eastOffset, y: southAlign };
    const southEast: Coords = { x: eastAlign, y: southOffset };
    const southWest: Coords = { x: westAlign, y: southOffset };
    const westSouth: Coords = { x: westOffset, y: southAlign };
    const westNorth: Coords = { x: westOffset, y: northAlign };
    const northWest: Coords = { x: westAlign, y: northOffset };
    const northEast: Coords = { x: eastAlign, y: northOffset };

    additionalPositions = [
      { orientation: CardinalOrientation.EASTNORTH, coords: eastNorth },
      { orientation: CardinalOrientation.EASTSOUTH, coords: eastSouth },
      { orientation: CardinalOrientation.SOUTHEAST, coords: southEast },
      { orientation: CardinalOrientation.SOUTHWEST, coords: southWest },
      { orientation: CardinalOrientation.WESTSOUTH, coords: westSouth },
      { orientation: CardinalOrientation.WESTNORTH, coords: westNorth },
      { orientation: CardinalOrientation.NORTHWEST, coords: northWest },
      { orientation: CardinalOrientation.NORTHEAST, coords: northEast },
    ];
  }

  return [
    ...preferredCandidates,
    ...standardPositions,
    ...additionalPositions,
    { orientation: CardinalOrientation.CENTER, coords: center },
  ];
}
