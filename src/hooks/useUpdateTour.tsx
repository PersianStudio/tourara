import React from 'react';
import type { TourLogic, TourOptions, TourProps, TourStep } from '../types';
import { isForeignTarget, type Coords, type Dims, getElementDims as utilGetElementDims } from '../utils/dom';
import {
  type OrientationCoords,
  getTargetPosition as utilGetTargetPosition,
  getTooltipPosition as utilGetTooltipPosition,
} from '../utils/positioning';
import {
  debounce,
  setFocusTrap,
  setNextOnTargetClick,
  setTargetWatcher,
  setTourUpdateListener,
  shouldUpdate as utilShouldUpdate,
} from '../utils/tour';
import { resolveOrientationPreferences } from '../utils/direction';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTargetPosition = utilGetTargetPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTooltipPosition = utilGetTooltipPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getElementDims = utilGetElementDims as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shouldUpdate = utilShouldUpdate as any;

export const useUpdateTour = ({
  options,
  tourOpen,
  tooltip,
  cleanup,
  tourLogic,
  tourRoot,
  setTooltipPosition,
  currentStepIndex,
  currentStepContent,
  setTarget,
  cleanupRefs,
}: {
  options: TourOptions & TourProps & TourStep;
  tourOpen: boolean;
  tooltip: React.MutableRefObject<HTMLElement | undefined>;
  cleanup: () => void;
  tourLogic: TourLogic;
  tourRoot: Element | undefined;
  setTooltipPosition: React.Dispatch<React.SetStateAction<OrientationCoords | undefined>>;
  currentStepIndex: number;
  currentStepContent: TourStep;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
  cleanupRefs: React.MutableRefObject<(() => void)[]>;
  target: HTMLElement | undefined;
  waitForTargetsTimeOut?: number;
}) => {
  const targetPosition = React.useRef<Coords | null>(null);
  const targetSize = React.useRef<Dims | null>(null);
  const lastScrollKey = React.useRef('');

  const {
    selector,
    maskPadding,
    disableMaskInteraction,
    tooltipSeparation,
    orientationPreferences,
    disableAutoScroll,
    getPositionFromCandidates,
    movingTarget,
    renderTolerance,
    updateInterval,
    disableMask,
    setUpdateListener,
    removeUpdateListener,
    disableListeners,
    disableSmoothScroll,
    allowForeignTarget,
    nextOnTargetClick,
    validateNextOnTargetClick,
    direction = 'ltr',
  } = options;

  const root: Element | undefined = tourRoot;
  const tooltipContainer: HTMLElement | undefined = tooltip.current;

  const handleAbsenceOfNeededElements = () => {
    setTarget(undefined);
    setTooltipPosition(undefined);
  };

  const scrollTargetIntoView = (el: HTMLElement, scrollKey: string) => {
    if (disableAutoScroll) return;
    if (allowForeignTarget && root && selector && isForeignTarget(root, selector)) return;
    if (lastScrollKey.current === scrollKey) return;
    lastScrollKey.current = scrollKey;

    el.scrollIntoView({
      behavior: disableSmoothScroll ? 'auto' : 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  const updateTour = () => {
    cleanup();
    if (!root || !tooltipContainer) {
      handleAbsenceOfNeededElements();
      return;
    }

    const targetScope: Element | Document = allowForeignTarget ? document : root;
    const getTarget = (): HTMLElement | undefined =>
      (targetScope.querySelector(selector) as HTMLElement) || undefined;
    const currentTarget: HTMLElement | undefined = getTarget();

    if (currentTarget) {
      scrollTargetIntoView(currentTarget, `${currentStepIndex}:${selector}`);
    }

    const currentTargetPosition: Coords | undefined = getTargetPosition(root, currentTarget || undefined);
    const currentTargetDims: Dims | undefined = getElementDims(currentTarget || undefined);
    const smartPadding: number = disableMask ? 0 : maskPadding || 0;

    const resolvedPreferences = resolveOrientationPreferences(orientationPreferences, direction);

    const tooltipPosition: OrientationCoords = getTooltipPosition({
      target: currentTarget,
      tooltip: tooltipContainer,
      padding: smartPadding,
      tooltipSeparation,
      orientationPreferences: resolvedPreferences,
      root,
      getPositionFromCandidates,
      disableAutoScroll,
      allowForeignTarget,
      selector,
    });

    setTarget(currentTarget);
    setTooltipPosition(tooltipPosition);
    targetPosition.current = currentTargetPosition ?? null;
    targetSize.current = currentTargetDims ?? null;

    const cleanupFocusTrap = setFocusTrap(tooltipContainer, currentTarget, disableMaskInteraction);
    cleanupRefs.current.push(cleanupFocusTrap);

    if (!disableListeners) {
      const conditionalUpdate = () => {
        const availableTarget = getTarget();
        if (
          shouldUpdate({
            root,
            tooltipPosition: tooltipPosition.coords,
            tooltip: tooltipContainer,
            target: availableTarget,
            disableAutoScroll,
            rerenderTolerance: renderTolerance,
            targetCoords: targetPosition.current,
            targetDims: targetSize.current,
            allowForeignTarget,
            selector,
            getPositionFromCandidates,
            orientationPreferences: resolvedPreferences,
            padding: smartPadding,
            tooltipSeparation,
          })
        ) {
          updateTour();
        }
      };
      const cleanupUpdateListener = setTourUpdateListener({
        update: debounce(conditionalUpdate),
        customSetListener: setUpdateListener,
        customRemoveListener: removeUpdateListener,
      });

      cleanupRefs.current.push(cleanupUpdateListener);
      if (movingTarget && (currentTarget || selector)) {
        const cleanupWatcher = setTargetWatcher(conditionalUpdate, updateInterval || 0);
        cleanupRefs.current.push(cleanupWatcher);
      }
      if (nextOnTargetClick && currentTarget) {
        const cleanupTargetTether = setNextOnTargetClick(currentTarget, tourLogic.next, validateNextOnTargetClick);
        cleanupRefs.current.push(cleanupTargetTether);
      }
    }
  };

  const startUltraFastUpdates = (duration = 2000, stabilityThreshold = 5) => {
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
  };

  React.useEffect(() => {
    lastScrollKey.current = '';
  }, [currentStepIndex, selector]);

  React.useEffect(() => {
    let stopUltraFastUpdates: (() => void) | undefined;
    let raf = 0;

    if (!tourOpen || !tourRoot) {
      cleanup();
      return;
    }

    raf = requestAnimationFrame(() => {
      if (tooltip.current) {
        tooltip.current.focus({ preventScroll: true });
        stopUltraFastUpdates = startUltraFastUpdates(1800, 5);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      if (stopUltraFastUpdates) stopUltraFastUpdates();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, currentStepContent, tourOpen, tourRoot, tooltipSeparation]);

  return { updateTour };
};
