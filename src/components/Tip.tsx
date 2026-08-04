import { Box, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TipIcon } from '../icons';
import type { TourStep } from '../types';
import {
  CardinalOrientation,
  type OrientationCoords,
  getTargetPosition as utilGetTargetPosition,
  getTooltipPosition as utilGetTooltipPosition,
} from '../utils/positioning';
import { getCornerStyles } from '../utils/tipCorner';
import { isElementInView as utilIsElementInView } from '../utils/viewport';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTargetPosition = utilGetTargetPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTooltipPosition = utilGetTooltipPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isElementInView = utilIsElementInView as any;

interface InactiveTooltipProps {
  step: TourStep;
  isVisible?: boolean;
  containerRoot?: Element;
  index: number;
  activeIndex: number;
  goToStep: (stepIndex: number) => void;
}

export const Tip: React.FC<InactiveTooltipProps> = ({
  step,
  isVisible = true,
  containerRoot,
  index,
  activeIndex,
}) => {
  const theme = useTheme();
  const [orientationCoords, setOrientationCoords] = useState<OrientationCoords | null>(null);
  const [cornerStyles, setCornerStyles] = useState<React.CSSProperties>({});
  const tipRef = React.useRef<HTMLElement | undefined>(undefined);
  const [isInViewport, setIsInViewport] = useState(true);
  const targetElement = containerRoot?.querySelector(step.selector) as HTMLElement;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCornerStyles(getCornerStyles(orientationCoords?.orientation));
  }, [orientationCoords]);

  const updateDimensions = () => {
    if (
      !isInViewport ||
      !containerRoot ||
      !step.selector ||
      index === activeIndex ||
      !targetElement ||
      orientationCoords?.orientation === CardinalOrientation.CENTER
    ) {
      setOrientationCoords(null);
      return;
    }

    if (!targetElement) {
      setOrientationCoords(null);
      return;
    }

    const targetPos = getTargetPosition(containerRoot, targetElement);
    if (targetPos) {
      const tipPosition: OrientationCoords = getTooltipPosition({
        target: targetElement,
        tooltip: tipRef.current,
        padding: 0,
        tooltipSeparation: 0,
        orientationPreferences: step.tipOrientationPreferences,
        root: containerRoot,
        getPositionFromCandidates: undefined,
        disableAutoScroll: false,
        allowForeignTarget: false,
        selector: step?.selector,
        isPreferredCandidatesIncluded: true,
      });

      setOrientationCoords({
        orientation: tipPosition?.orientation,
        coords: {
          x: tipPosition?.coords.x,
          y: tipPosition?.coords.y,
        },
      });
    }
  };

  const scheduleViewportCheck = useCallback(() => {
    if (!targetElement || !isElementInView) return;

    const startTime = Date.now();
    const duration = 500;
    const interval = 100;

    const poll = () => {
      if (Date.now() - startTime < duration) {
        if (isElementInView(containerRoot, targetElement)) {
          setIsInViewport(true);
        } else {
          setIsInViewport(false);
        }

        timeoutRef.current = setTimeout(poll, interval);
      }
    };

    poll();
  }, [targetElement, containerRoot]);

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRoot]);

  useEffect(() => {
    updateDimensions();
    scheduleViewportCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRoot, step.selector, index, activeIndex, tipRef.current, targetElement]);

  if (
    !isInViewport ||
    !orientationCoords?.coords ||
    !isVisible ||
    index === activeIndex ||
    !targetElement ||
    orientationCoords?.orientation === CardinalOrientation.CENTER
  ) {
    return null;
  }

  return (
    <Box
      ref={tipRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
      sx={{
        position: 'absolute',
        top: orientationCoords?.coords.y,
        left: orientationCoords?.coords.x,
        width: 38,
        height: 38,
        borderColor: 'grey.900',
        zIndex: 9999,
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        borderBottomLeftRadius: '50%',
        transformOrigin: 'center center',
        transform: 'none',
        ...cornerStyles,
        borderWidth: '5px',
        pointerEvents: 'all',
        bgcolor: 'grey.900',
      }}
    >
      <Box
        sx={{
          borderRadius: '50%',
          bgcolor: theme.palette.primary.main,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.primary.contrastText,
        }}
      >
        <TipIcon />
      </Box>
    </Box>
  );
};
