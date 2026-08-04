import React from 'react';
import { TourStep, TourLogic, TourOptions, TourProps } from '../types';
import { Coords, Dims, getElementDims as utilGetElementDims } from '../utils/dom';
// import { centerViewportAroundElements } from '../utils/offset';
import {
  OrientationCoords,
  getTargetPosition as utilGetTargetPosition,
  getTooltipPosition as utilGetTooltipPosition,
} from '../utils/positioning';

import {
  debounce,
  setFocusTrap,
  setNextOnTargetClick,
  setTargetWatcher,
  setTourUpdateListener,
  shouldScroll,
  shouldUpdate as utilShouldUpdate,
} from '../utils/tour';

const getTargetPosition = utilGetTargetPosition as any;
const getTooltipPosition = utilGetTooltipPosition as any;
const getElementDims = utilGetElementDims as any;
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
  target,
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
  const targetPosition: any = React.useRef<Coords>(null);
  const targetSize: any = React.useRef<Dims>(null);

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
    // disableSmoothScroll,
    allowForeignTarget,
    nextOnTargetClick,
    validateNextOnTargetClick,
    steps,
  } = options;

  const root: Element | undefined = tourRoot;
  const tooltipContainer: HTMLElement | undefined = tooltip.current;

  // Helper: Check if all targets are visible
  // const checkTargetsVisibility = () => {
  //   return steps.every((step) => {
  //     const targetScope = document;
  //     return !!targetScope.querySelector(step.selector);
  //   });
  // };

  // Helper: Handle missing target elements
  const handleAbsenceOfNeededElements = () => {
    setTarget(undefined);
    setTooltipPosition(undefined);
  };

  // update tooltip and target position in state
  const updateTour = () => {
    cleanup();
    if (!root || !tooltipContainer) {
      handleAbsenceOfNeededElements();
      return;
    }

    const targetScope: Element | Document = allowForeignTarget ? document : root;
    const getTarget = (): HTMLElement | undefined => (targetScope.querySelector(selector) as HTMLElement) || undefined;
    const currentTarget: HTMLElement | undefined = getTarget();
    currentTarget?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    const currentTargetPosition: Coords | undefined = getTargetPosition(root, currentTarget || undefined);
    const currentTargetDims: Dims | undefined = getElementDims(currentTarget || undefined);
    const smartPadding: number = disableMask ? 0 : maskPadding || 0;

    const tooltipPosition: OrientationCoords = getTooltipPosition({
      target: currentTarget,
      tooltip: tooltipContainer,
      padding: smartPadding,
      tooltipSeparation,
      orientationPreferences,
      root,
      getPositionFromCandidates,
      disableAutoScroll,
      allowForeignTarget,
      selector,
    });

    setTarget(currentTarget);
    setTooltipPosition(tooltipPosition);
    targetPosition.current = currentTargetPosition;
    targetSize.current = currentTargetDims;

    //focus trap subroutine
    const cleanupFocusTrap = setFocusTrap(tooltipContainer, currentTarget, disableMaskInteraction);
    cleanupRefs.current.push(cleanupFocusTrap);

    // if (
    //   shouldScroll({
    //     disableAutoScroll,
    //     allowForeignTarget,
    //     selector,
    //     root,
    //     target: currentTarget,
    //     tooltip: tooltipContainer,
    //     tooltipPosition: tooltipPosition.coords,
    //   })
    // ) {
    //   scrollToDestination(
    //     root,
    //     centerViewportAroundElements(
    //       root,
    //       tooltipContainer,
    //       currentTarget,
    //       tooltipPosition.coords,
    //       currentTargetPosition,
    //     ),
    //     disableSmoothScroll,
    //   );
    // }

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
            orientationPreferences,
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
      // if the user requests a watcher and there's supposed to be a target
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

  // Ultra-Fast Updates with Stability Check
  const startUltraFastUpdates = (duration = 2000, stabilityThreshold = 5) => {
    // const allTargetsVisible = checkTargetsVisibility();
    const startTime = Date.now();
    let animationFrameId: any;
    let stabilityCounter = 0;
    let lastPosition: any = null;
    let lastSize: any = null;

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

      lastPosition = { ...currentTargetPosition };
      lastSize = { ...currentTargetSize };

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

  // React Effect: Trigger updates when the tour changes
  React.useEffect(() => {
    let stopUltraFastUpdates: (() => void) | undefined;
    let raf = 0;

    if (!tourOpen || !tourRoot) {
      cleanup();
      return;
    }

    // Ref is assigned after commit — wait one frame so tooltip.current exists.
    raf = requestAnimationFrame(() => {
      if (tooltip.current) {
        tooltip.current.focus({ preventScroll: true });
        stopUltraFastUpdates = startUltraFastUpdates(1500, 5);
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
