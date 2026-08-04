/**
 * Core tour re-layout: resolve target, place tooltip, install focus trap and
 * update listeners (resize / movingTarget / nextOnTargetClick). Recurses via
 * conditionalUpdate when shouldUpdate says the geometry drifted.
 */

import type React from 'react';
import type { TourLogic, TourOptions, TourProps, TourStep } from '../../types';
import { type Coords, type Dims, getElementDims as utilGetElementDims } from '../../utils/dom';
import {
  type OrientationCoords,
  getTargetPosition as utilGetTargetPosition,
  getTooltipPosition as utilGetTooltipPosition,
} from '../../utils/positioning';
import {
  debounce,
  setFocusTrap,
  setNextOnTargetClick,
  setTargetWatcher,
  setTourUpdateListener,
  shouldUpdate as utilShouldUpdate,
} from '../../utils/tour';
import { resolveOrientationPreferences } from '../../utils/direction';
import { scrollTargetIntoView } from './scrollTargetIntoView';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTargetPosition = utilGetTargetPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTooltipPosition = utilGetTooltipPosition as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getElementDims = utilGetElementDims as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shouldUpdate = utilShouldUpdate as any;

export interface RunTourUpdateArgs {
  options: TourOptions & TourProps & TourStep;
  tooltip: React.MutableRefObject<HTMLElement | undefined>;
  cleanup: () => void;
  tourLogic: TourLogic;
  tourRoot: Element | undefined;
  setTooltipPosition: React.Dispatch<React.SetStateAction<OrientationCoords | undefined>>;
  currentStepIndex: number;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
  cleanupRefs: React.MutableRefObject<(() => void)[]>;
  targetPosition: React.MutableRefObject<Coords | null>;
  targetSize: React.MutableRefObject<Dims | null>;
  lastScrollKey: React.MutableRefObject<string>;
}

export function runTourUpdate(args: RunTourUpdateArgs): void {
  const {
    options,
    tooltip,
    cleanup,
    tourLogic,
    tourRoot,
    setTooltipPosition,
    currentStepIndex,
    setTarget,
    cleanupRefs,
    targetPosition,
    targetSize,
    lastScrollKey,
  } = args;

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
    scrollTargetIntoView({
      el: currentTarget,
      scrollKey: `${currentStepIndex}:${selector}`,
      lastScrollKey,
      disableAutoScroll,
      disableSmoothScroll,
      allowForeignTarget,
      root,
      selector,
    });
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
        runTourUpdate(args);
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
}
