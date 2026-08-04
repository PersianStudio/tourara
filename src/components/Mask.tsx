import { useTheme } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Coords, Dims, ElementInfo } from '../utils/dom';
import { getViewportScrollDims } from '../utils/viewport';

export interface MaskOptions {
  targetInfo?: ElementInfo;
  padding: number;
  radius: number;
  close: () => void;
  tourRoot: Element;
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  maskId: string;
  disableMask?: boolean;
}

export function Mask(props: MaskOptions) {
  const {
    targetInfo,
    disableMaskInteraction,
    padding,
    radius,
    tourRoot,
    close,
    disableCloseOnClick,
    maskId,
    disableMask,
  } = props;
  const pathId = `clip-path-${maskId}`;
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [{ width: containerWidth, height: containerHeight }, setContainerDims] = useState<Dims>(
    getViewportScrollDims(tourRoot),
  );

  useEffect(() => {
    const updateDimensions = () => {
      setContainerDims(getViewportScrollDims(tourRoot));
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [tourRoot]);

  const getCutoutPath = (target?: { coords: Coords; dims: Dims }): string => {
    if (!target) {
      return '';
    }

    const { dims, coords } = target;

    const cutoutTop: number = coords.y - padding;
    const cutoutLeft: number = coords.x - padding;
    const cutoutRight: number = coords.x + dims.width + padding;
    const cutoutBottom: number = coords.y + dims.height + padding;

    if (radius > 0) {
      return `M 0, 0
              L 0, ${containerHeight}
              L ${cutoutLeft}, ${containerHeight}
              L ${cutoutLeft}, ${cutoutTop + radius}
              Q ${cutoutLeft}, ${cutoutTop}, ${cutoutLeft + radius}, ${cutoutTop}
              L ${cutoutRight - radius}, ${cutoutTop}
              Q ${cutoutRight}, ${cutoutTop}, ${cutoutRight}, ${cutoutTop + radius}
              L ${cutoutRight}, ${cutoutBottom - radius}
              Q ${cutoutRight}, ${cutoutBottom}, ${cutoutRight - radius}, ${cutoutBottom}
              L ${cutoutLeft + radius}, ${cutoutBottom}
              Q ${cutoutLeft}, ${cutoutBottom}, ${cutoutLeft}, ${cutoutBottom - radius}
              L ${cutoutLeft}, ${containerHeight}
              L ${containerWidth}, ${containerHeight}
              L ${containerWidth}, 0`;
    }

    return `M 0, 0
            L 0, ${containerHeight}
            L ${cutoutLeft}, ${containerHeight}
            L ${cutoutLeft}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutBottom}
            L ${cutoutLeft}, ${cutoutBottom}
            L ${cutoutLeft}, ${containerHeight}
            L ${containerWidth}, ${containerHeight}
            L ${containerWidth}, 0`;
  };

  const getBorderPath = (target?: { coords: Coords; dims: Dims }): string => {
    if (!target) return '';

    const { dims, coords } = target;

    const cutoutTop = coords.y - padding;
    const cutoutLeft = coords.x - padding;
    const cutoutRight = coords.x + dims.width + padding;
    const cutoutBottom = coords.y + dims.height + padding;

    if (radius > 0) {
      return `M ${cutoutLeft + radius}, ${cutoutTop}
              L ${cutoutRight - radius}, ${cutoutTop}
              Q ${cutoutRight}, ${cutoutTop}, ${cutoutRight}, ${cutoutTop + radius}
              L ${cutoutRight}, ${cutoutBottom - radius}
              Q ${cutoutRight}, ${cutoutBottom}, ${cutoutRight - radius}, ${cutoutBottom}
              L ${cutoutLeft + radius}, ${cutoutBottom}
              Q ${cutoutLeft}, ${cutoutBottom}, ${cutoutLeft}, ${cutoutBottom - radius}
              L ${cutoutLeft}, ${cutoutTop + radius}
              Q ${cutoutLeft}, ${cutoutTop}, ${cutoutLeft + radius}, ${cutoutTop}`;
    }

    return `M ${cutoutLeft}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutBottom}
            L ${cutoutLeft}, ${cutoutBottom}
            Z`;
  };

  const svgStyle: React.CSSProperties = {
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
    pointerEvents: disableMaskInteraction ? 'auto' : 'none',
  };

  return disableMask ? null : (
    <svg style={svgStyle}>
      {targetInfo && (
        <defs>
          <clipPath id={pathId}>
            <path d={getCutoutPath(targetInfo)} />
          </clipPath>
        </defs>
      )}

      {targetInfo && (
        <path
          d={getBorderPath(targetInfo)}
          stroke={isDark ? '#fff' : '#000'}
          strokeWidth={1.5}
          fill="none"
          pointerEvents="none"
        />
      )}

      <rect
        onClick={disableCloseOnClick ? undefined : () => close()}
        x={0}
        y={0}
        width={containerWidth}
        height={containerHeight}
        fill={isDark ? '#fff' : '#000'}
        fillOpacity={isDark ? 0.12 : 0.32}
        pointerEvents="auto"
        clipPath={targetInfo ? `url(#${pathId})` : undefined}
      />
    </svg>
  );
}
