/**
 * Tooltip corner / SVG styles based on orientation and nearest target corner.
 */
// @ts-nocheck

import { SxProps, Theme } from '@mui/material';
import { TourOptions } from '../types';
import { CardinalOrientation } from './positioning';

/**
 * Returns a CSS style object that zeros out (border-radius=0)
 * the corner of `secondElement` which is closest to one corner of `targetElement`.
 *
 * We compare *all corners* of `targetElement` to *all corners* of `secondElement`,
 * find the closest pair, and then zero out that corner of the *second* element.
 */
export function getCornerStyles(
  orientation: CardinalOrientation | undefined,
  targetElement: HTMLElement | undefined,
  secondElement: HTMLElement | undefined,
  corner: TourOptions['corner'],
): { style: SxProps<Theme>; svgStyle: SxProps<Theme> } {
  const skipList = [
    CardinalOrientation.CENTER,
    CardinalOrientation.EAST,
    CardinalOrientation.SOUTH,
    CardinalOrientation.NORTH,
    CardinalOrientation.WEST,
  ];
  // If orientation is missing or CENTER, you might skip corner logic entirely
  // (depending on your desired behavior).
  const style: SxProps<Theme> = {};
  const svgStyle: SxProps<Theme> = {};

  if (!orientation || skipList.includes(orientation)) {
    return { style, svgStyle };
  }

  // 1) Get bounding boxes for both elements
  const rectA = targetElement.getBoundingClientRect();
  const rectB = secondElement.getBoundingClientRect();

  // 2) Compute the coordinates for each corner of the first element (A)
  const cornersA = {
    topLeft: { x: rectA.left, y: rectA.top },
    topRight: { x: rectA.right, y: rectA.top },
    bottomLeft: { x: rectA.left, y: rectA.bottom },
    bottomRight: { x: rectA.right, y: rectA.bottom },
  };

  // 3) Compute the coordinates for each corner of the second element (B)
  const cornersB = {
    topLeft: { x: rectB.left, y: rectB.top },
    topRight: { x: rectB.right, y: rectB.top },
    bottomLeft: { x: rectB.left, y: rectB.bottom },
    bottomRight: { x: rectB.right, y: rectB.bottom },
  };

  // Helper function to compute Euclidean distance
  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
    Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

  // 4) Find the closest pair of corners (one in A, one in B).
  //    We'll keep track of which corner in B is closest, so we know which one to zero out.
  let minDistance = Number.POSITIVE_INFINITY;
  let closestCornerB: keyof typeof cornersB = 'topLeft';

  for (const cornerNameA in cornersA) {
    const cA = cornersA[cornerNameA as keyof typeof cornersA];

    for (const cornerNameB in cornersB) {
      const cB = cornersB[cornerNameB as keyof typeof cornersB];
      const dist = distance(cA, cB);

      if (dist < minDistance) {
        minDistance = dist;
        closestCornerB = cornerNameB as keyof typeof cornersB;
      }
    }
  }

  // 5) Now that we know which corner of B is closest, zero out that corner
  switch (closestCornerB) {
    case 'topLeft':
      if (corner === 'small') {
        svgStyle.top = -15;
        svgStyle.left = -30;
      }
      svgStyle.transform = 'scaleX(-1)';
      style.borderTopLeftRadius = '0px';

      break;
    case 'topRight':
      if (corner === 'small') {
        svgStyle.top = -15;
        svgStyle.right = -30;
      }
      style.borderTopRightRadius = '0px';

      break;
    case 'bottomLeft':
      if (corner === 'small') {
        svgStyle.bottom = -15;
        svgStyle.left = -30;
      }
      svgStyle.transform = 'scale(-1, -1)';
      style.borderBottomLeftRadius = '0px';

      break;
    case 'bottomRight':
      if (corner === 'small') {
        svgStyle.bottom = -15;
        svgStyle.right = -30;
      }
      svgStyle.transform = 'scaleY(-1)';
      style.borderBottomRightRadius = '0px';

      break;
  }

  // 6) Optionally, use orientation or coords for more styling, e.g. rotate, transformOrigin, etc.
  //    For instance:
  /*
  if (orientation === CardinalOrientation.NORTH) {
    style.transform = 'rotate(45deg)';
    style.transformOrigin = 'center bottom'; 
  }
  */

  return { style, svgStyle };
}
