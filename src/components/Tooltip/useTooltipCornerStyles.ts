/**
 * Hook that derives tooltip + SVG corner styles from orientation and DOM targets.
 */
import type { SxProps, Theme } from '@mui/material';
import * as React from 'react';
import type { TourStep } from '../../types';
import type { OrientationCoords } from '../../utils/positioning';
import { getCornerStyles } from '../../utils/tooltipCorner';

interface UseTooltipCornerStylesArgs {
  tooltipPosition: OrientationCoords | undefined;
  stepIndex: number;
  allSteps: TourStep[];
  tooltipRef: React.MutableRefObject<HTMLElement | undefined>;
  corner: TourStep['corner'];
}

/**
 * Debounced effect that positions the tooltip corner SVG against the target element.
 * Returns MUI `sx` for the tooltip shell and the corner graphic.
 */
export function useTooltipCornerStyles({
  tooltipPosition,
  stepIndex,
  allSteps,
  tooltipRef,
  corner,
}: UseTooltipCornerStylesArgs) {
  const [cornerStyles, setCornerStyles] = React.useState<{
    style: SxProps<Theme>;
    svgStyle: SxProps<Theme>;
  }>();

  React.useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    const applyStyles = () => {
      const target = window.document.querySelector(allSteps?.[stepIndex]?.selector) as HTMLElement | undefined;
      const cornerStyle = getCornerStyles(tooltipPosition?.orientation, target, tooltipRef.current, corner);
      setCornerStyles(cornerStyle);
    };

    debounceTimer = setTimeout(applyStyles, 50);
    return () => clearTimeout(debounceTimer);
  }, [tooltipPosition, stepIndex, allSteps, tooltipRef, corner]);

  return cornerStyles;
}
