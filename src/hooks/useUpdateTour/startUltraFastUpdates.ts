/**
 * requestAnimationFrame burst that keeps calling updateTour until the target
 * geometry is stable for N frames or the duration budget expires. Used when a
 * step opens so late-layouting targets settle quickly.
 */

import type { Coords, Dims } from '../../utils/dom';

export interface StartUltraFastUpdatesArgs {
  updateTour: () => void;
  targetPosition: { current: Coords | null };
  targetSize: { current: Dims | null };
  duration?: number;
  stabilityThreshold?: number;
}

export function startUltraFastUpdates({
  updateTour,
  targetPosition,
  targetSize,
  duration = 2000,
  stabilityThreshold = 5,
}: StartUltraFastUpdatesArgs): () => void {
  const startTime = Date.now();
  let animationFrameId = 0;
  let stabilityCounter = 0;
  let lastPosition: Coords | null = null;
  let lastSize: Dims | null = null;

  const isElementStable = (currentPosition: Coords | null, currentSize: Dims | null) => {
    if (!lastPosition || !lastSize) return false;
    return (
      currentPosition?.x === lastPosition?.x &&
      currentPosition?.y === lastPosition?.y &&
      currentSize?.width === lastSize?.width &&
      currentSize?.height === lastSize?.height
    );
  };

  const ultraFastUpdate = () => {
    const elapsedTime = Date.now() - startTime;
    const currentTargetPosition = targetPosition.current;
    const currentTargetSize = targetSize.current;

    if (isElementStable(currentTargetPosition, currentTargetSize)) {
      stabilityCounter++;
    } else {
      stabilityCounter = 0;
    }

    lastPosition = currentTargetPosition ? { ...currentTargetPosition } : null;
    lastSize = currentTargetSize ? { ...currentTargetSize } : null;

    if (elapsedTime < duration && stabilityCounter < stabilityThreshold) {
      updateTour();
      animationFrameId = requestAnimationFrame(ultraFastUpdate);
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  };

  ultraFastUpdate();
  return () => cancelAnimationFrame(animationFrameId);
}
