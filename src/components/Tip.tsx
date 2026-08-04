import { Box, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TipIcon } from '../icons';
import type { TourStep } from '../types';
import { defaultTipOrientations, resolveOrientationPreferences, type TourDirection } from '../utils/direction';
import { CardinalOrientation } from '../utils/positioning';
import { isElementInView as utilIsElementInView } from '../utils/viewport';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isElementInView = utilIsElementInView as any;

const TIP_SIZE = 26;
const TIP_GAP = 8;

interface InactiveTooltipProps {
  step: TourStep;
  isVisible?: boolean;
  containerRoot?: Element;
  index: number;
  activeIndex: number;
  goToStep: (stepIndex: number) => void;
  direction?: TourDirection;
}

function placeTipMarker(
  target: HTMLElement,
  preferences: CardinalOrientation[],
): { x: number; y: number; orientation: CardinalOrientation } | null {
  const rect = target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const candidates: Array<{ orientation: CardinalOrientation; x: number; y: number }> = preferences.map(
    (orientation) => {
      switch (orientation) {
        case CardinalOrientation.EAST:
          return {
            orientation,
            x: rect.right + TIP_GAP,
            y: rect.top + rect.height / 2 - TIP_SIZE / 2,
          };
        case CardinalOrientation.WEST:
          return {
            orientation,
            x: rect.left - TIP_GAP - TIP_SIZE,
            y: rect.top + rect.height / 2 - TIP_SIZE / 2,
          };
        case CardinalOrientation.SOUTH:
          return {
            orientation,
            x: rect.left + rect.width / 2 - TIP_SIZE / 2,
            y: rect.bottom + TIP_GAP,
          };
        case CardinalOrientation.NORTH:
          return {
            orientation,
            x: rect.left + rect.width / 2 - TIP_SIZE / 2,
            y: rect.top - TIP_GAP - TIP_SIZE,
          };
        case CardinalOrientation.SOUTHEAST:
        case CardinalOrientation.EASTSOUTH:
          return { orientation, x: rect.right + TIP_GAP, y: rect.bottom - TIP_SIZE };
        case CardinalOrientation.NORTHEAST:
        case CardinalOrientation.EASTNORTH:
          return { orientation, x: rect.right + TIP_GAP, y: rect.top };
        case CardinalOrientation.SOUTHWEST:
        case CardinalOrientation.WESTSOUTH:
          return { orientation, x: rect.left - TIP_GAP - TIP_SIZE, y: rect.bottom - TIP_SIZE };
        case CardinalOrientation.NORTHWEST:
        case CardinalOrientation.WESTNORTH:
          return { orientation, x: rect.left - TIP_GAP - TIP_SIZE, y: rect.top };
        case CardinalOrientation.CENTER:
        default:
          return {
            orientation: CardinalOrientation.EAST,
            x: rect.right + TIP_GAP,
            y: rect.top + rect.height / 2 - TIP_SIZE / 2,
          };
      }
    },
  );

  const fits = (x: number, y: number) =>
    x >= 4 && y >= 4 && x + TIP_SIZE <= window.innerWidth - 4 && y + TIP_SIZE <= window.innerHeight - 4;

  for (const c of candidates) {
    if (fits(c.x, c.y)) return c;
  }

  const fallbackSide = preferences[0] === CardinalOrientation.WEST ? 'west' : 'east';
  return {
    orientation: fallbackSide === 'west' ? CardinalOrientation.WEST : CardinalOrientation.EAST,
    x:
      fallbackSide === 'west'
        ? Math.max(4, rect.left - TIP_GAP - TIP_SIZE)
        : Math.min(Math.max(4, rect.right + TIP_GAP), window.innerWidth - TIP_SIZE - 4),
    y: Math.min(Math.max(4, rect.top + rect.height / 2 - TIP_SIZE / 2), window.innerHeight - TIP_SIZE - 4),
  };
}

export const Tip: React.FC<InactiveTooltipProps> = ({
  step,
  isVisible = true,
  containerRoot,
  index,
  activeIndex,
  direction = 'ltr',
}) => {
  const theme = useTheme();
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [inView, setInView] = useState(true);
  const rafRef = useRef(0);

  const resolveTarget = useCallback((): HTMLElement | null => {
    return (
      (document.querySelector(step.selector) as HTMLElement | null) ||
      (containerRoot?.querySelector(step.selector) as HTMLElement | null) ||
      null
    );
  }, [step.selector, containerRoot]);

  const update = useCallback(() => {
    if (index === activeIndex) {
      setCoords(null);
      return;
    }
    const target = resolveTarget();
    if (!target) {
      setCoords(null);
      return;
    }

    const visible = containerRoot ? isElementInView(containerRoot, target) : true;
    const rect = target.getBoundingClientRect();
    const onScreen =
      Boolean(visible) &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth;

    setInView(onScreen);
    if (!onScreen) {
      setCoords(null);
      return;
    }

    const prefs =
      resolveOrientationPreferences(step.tipOrientationPreferences, direction) || defaultTipOrientations(direction);
    const placed = placeTipMarker(target, prefs);
    setCoords(placed ? { x: placed.x, y: placed.y } : null);
  }, [index, activeIndex, resolveTarget, containerRoot, step.tipOrientationPreferences, direction]);

  const scheduleUpdate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      update();
    });
  }, [update]);

  useEffect(() => {
    update();
    window.addEventListener('resize', scheduleUpdate);
    // Capture scroll on any scrollable ancestor so tips stick to targets during tour auto-scroll.
    window.addEventListener('scroll', scheduleUpdate, true);
    const id = window.setInterval(update, 100);
    return () => {
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
      window.clearInterval(id);
      cancelAnimationFrame(rafRef.current);
    };
  }, [update, scheduleUpdate]);

  if (!inView || !coords || !isVisible || index === activeIndex) {
    return null;
  }

  // `fixed` + viewport coords: tips stay glued to targets as the page moves;
  // no CSS transition — lag made markers look like they were scrolling independently.
  return (
    <Box
      sx={{
        position: 'fixed',
        top: coords.y,
        left: coords.x,
        width: TIP_SIZE,
        height: TIP_SIZE,
        zIndex: 10001,
        borderRadius: '50%',
        pointerEvents: 'none',
        bgcolor: 'grey.900',
        border: '2px solid',
        borderColor: 'grey.900',
        boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
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
