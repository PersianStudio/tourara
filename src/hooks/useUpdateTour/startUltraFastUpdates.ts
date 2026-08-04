/**
 * Short rAF settle after a step opens. Geometry-only — never rebinds listeners.
 */

import type { Coords, Dims } from '../../utils/dom';

export interface StartSettleLoopArgs {
  updateGeometry: () => void;
  targetPosition: { current: Coords | null };
  targetSize: { current: Dims | null };
  duration?: number;
  stabilityThreshold?: number;
}

export function startSettleLoop({
  updateGeometry,
  targetPosition,
  targetSize,
  duration = 480,
  stabilityThreshold = 3,
}: StartSettleLoopArgs): () => void {
  const startTime = Date.now();
  let animationFrameId = 0;
  let stabilityCounter = 0;
  let lastPosition: Coords | null = null;
  let lastSize: Dims | null = null;

  const isStable = (pos: Coords | null, size: Dims | null) => {
    if (!lastPosition || !lastSize || !pos || !size) return false;
    return (
      pos.x === lastPosition.x &&
      pos.y === lastPosition.y &&
      size.width === lastSize.width &&
      size.height === lastSize.height
    );
  };

  const tick = () => {
    updateGeometry();

    const pos = targetPosition.current;
    const size = targetSize.current;

    if (isStable(pos, size)) {
      stabilityCounter += 1;
    } else {
      stabilityCounter = 0;
    }

    lastPosition = pos ? { ...pos } : null;
    lastSize = size ? { ...size } : null;

    const elapsed = Date.now() - startTime;
    if (elapsed < duration && stabilityCounter < stabilityThreshold) {
      animationFrameId = requestAnimationFrame(tick);
    }
  };

  animationFrameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(animationFrameId);
}

/** @deprecated Alias — prefer startSettleLoop. */
export const startUltraFastUpdates = startSettleLoop;
