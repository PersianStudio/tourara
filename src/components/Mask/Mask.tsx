/**
 * SVG overlay that dims the viewport and cuts out the highlighted target.
 * Optionally blocks interaction / closes the tour on outside click.
 */
import { useTheme } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Dims, ElementInfo } from '../../utils/dom';
import { getViewportScrollDims } from '../../utils/viewport';
import { getBorderPath, getCutoutPath } from './maskPaths';

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
      const next = getViewportScrollDims(tourRoot);
      setContainerDims((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      );
    };

    window.addEventListener('resize', updateDimensions, { passive: true });
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [tourRoot]);

  const pathOptions = { padding, radius, containerWidth, containerHeight };

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
            <path d={getCutoutPath(targetInfo, pathOptions)} />
          </clipPath>
        </defs>
      )}

      {targetInfo && (
        <path
          d={getBorderPath(targetInfo, { padding, radius })}
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
