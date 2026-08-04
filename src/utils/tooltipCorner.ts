/**
 * Tooltip corner / SVG styles based on orientation and nearest target corner.
 * Returns plain React CSSProperties (no MUI).
 */
//@ts-nocheck

import type { CSSProperties } from 'react';
import type { TourOptions } from '../types';
import { CardinalOrientation } from './positioning';

export function getCornerStyles(
  orientation: CardinalOrientation | undefined,
  targetElement: HTMLElement | undefined,
  secondElement: HTMLElement | undefined,
  corner: TourOptions['corner'],
): { style: CSSProperties; svgStyle: CSSProperties } {
  const skipList = [
    CardinalOrientation.CENTER,
    CardinalOrientation.EAST,
    CardinalOrientation.SOUTH,
    CardinalOrientation.NORTH,
    CardinalOrientation.WEST,
  ];
  const style: CSSProperties = {};
  const svgStyle: CSSProperties = {};

  if (!orientation || skipList.includes(orientation) || !targetElement || !secondElement) {
    return { style, svgStyle };
  }

  const rectA = targetElement.getBoundingClientRect();
  const rectB = secondElement.getBoundingClientRect();

  const cornersA = {
    topLeft: { x: rectA.left, y: rectA.top },
    topRight: { x: rectA.right, y: rectA.top },
    bottomLeft: { x: rectA.left, y: rectA.bottom },
    bottomRight: { x: rectA.right, y: rectA.bottom },
  };

  const cornersB = {
    topLeft: { x: rectB.left, y: rectB.top },
    topRight: { x: rectB.right, y: rectB.top },
    bottomLeft: { x: rectB.left, y: rectB.bottom },
    bottomRight: { x: rectB.right, y: rectB.bottom },
  };

  const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

  let minDistance = Number.POSITIVE_INFINITY;
  let closestCornerB = 'topLeft';

  for (const cornerNameA in cornersA) {
    const cA = cornersA[cornerNameA];
    for (const cornerNameB in cornersB) {
      const cB = cornersB[cornerNameB];
      const dist = distance(cA, cB);
      if (dist < minDistance) {
        minDistance = dist;
        closestCornerB = cornerNameB;
      }
    }
  }

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

  return { style, svgStyle };
}
