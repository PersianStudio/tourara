/**
 * SVG overlay that dims the viewport and cuts out the highlighted target.
 * Theme-aware via prefers-color-scheme / data-theme — no MUI.
 */
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

function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'dark') return true;
      if (attr === 'light') return false;
    }
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'dark') {
        setIsDark(true);
        return;
      }
      if (attr === 'light') {
        setIsDark(false);
        return;
      }
      setIsDark(mq.matches);
    };
    sync();
    mq.addEventListener('change', sync);
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => {
      mq.removeEventListener('change', sync);
      mo.disconnect();
    };
  }, []);

  return isDark;
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
  const isDark = useIsDarkMode();

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
    window.addEventListener('orientationchange', updateDimensions, { passive: true });
    const vv = window.visualViewport;
    vv?.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      vv?.removeEventListener('resize', updateDimensions);
    };
  }, [tourRoot]);

  const pathOptions = { padding, radius, containerWidth, containerHeight };

  const svgStyle: React.CSSProperties = {
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    maxHeight: '100dvh',
    maxWidth: '100%',
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
