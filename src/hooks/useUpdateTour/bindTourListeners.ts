/**
 * Install once-per-step tour behaviors (focus trap, resize listener, optional
 * movingTarget watcher, nextOnTargetClick). Geometry updates must NOT call this
 * on every frame — that was a major CPU cost.
 */

import type React from 'react';
import type { TourLogic, TourOptions, TourProps, TourStep } from '../../types';
import type { Coords, Dims } from '../../utils/dom';
import type { OrientationCoords } from '../../utils/positioning';
import {
  debounce,
  setFocusTrap,
  setNextOnTargetClick,
  setTargetWatcher,
  setTourUpdateListener,
  shouldUpdate as utilShouldUpdate,
} from '../../utils/tour';
import { resolveOrientationPreferences } from '../../utils/direction';
import { createFrameScheduler } from '../../utils/frameScheduler';
import { applyTourGeometry } from './applyTourGeometry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shouldUpdate = utilShouldUpdate as any;

export interface BindTourListenersArgs {
  options: TourOptions & TourProps & TourStep;
  tooltip: React.MutableRefObject<HTMLElement | undefined>;
  tourLogic: TourLogic;
  tourRoot: Element | undefined;
  setTooltipPosition: React.Dispatch<React.SetStateAction<OrientationCoords | undefined>>;
  currentStepIndex: number;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
  cleanupRefs: React.MutableRefObject<(() => void)[]>;
  targetPosition: React.MutableRefObject<Coords | null>;
  targetSize: React.MutableRefObject<Dims | null>;
  lastScrollKey: React.MutableRefObject<string>;
  currentTarget: HTMLElement | undefined;
  /** Live tooltip coords ref updated by geometry passes. */
  tooltipCoordsRef: React.MutableRefObject<Coords | undefined>;
}

export function bindTourListeners(args: BindTourListenersArgs): void {
  const {
    options,
    tooltip,
    tourLogic,
    tourRoot,
    setTooltipPosition,
    currentStepIndex,
    setTarget,
    cleanupRefs,
    targetPosition,
    targetSize,
    lastScrollKey,
    currentTarget,
    tooltipCoordsRef,
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
    allowForeignTarget,
    nextOnTargetClick,
    validateNextOnTargetClick,
    direction = 'ltr',
  } = options;

  const root = tourRoot;
  const tooltipContainer = tooltip.current;
  if (!root || !tooltipContainer || disableListeners) return;

  const smartPadding = disableMask ? 0 : maskPadding || 0;
  const resolvedPreferences = resolveOrientationPreferences(orientationPreferences, direction);
  const targetScope: Element | Document = allowForeignTarget ? document : root;

  const cleanupFocusTrap = setFocusTrap(tooltipContainer, currentTarget, disableMaskInteraction);
  cleanupRefs.current.push(cleanupFocusTrap);

  const runGeometry = (allowScroll: boolean) => {
    applyTourGeometry({
      options,
      tooltip,
      tourRoot,
      setTooltipPosition,
      currentStepIndex,
      setTarget,
      targetPosition,
      targetSize,
      lastScrollKey,
      allowScroll,
    });
  };

  const conditionalUpdate = () => {
    const availableTarget =
      (targetScope.querySelector(selector) as HTMLElement | null) || undefined;
    if (
      shouldUpdate({
        root,
        tooltipPosition: tooltipCoordsRef.current,
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
      // Scroll keys already recorded for this step — do not re-fire scrollIntoView.
      runGeometry(false);
    }
  };

  // Resize can burst; scroll must track every frame while smooth scrollIntoView runs.
  const onResize = debounce(conditionalUpdate, 150);
  const { schedule: scheduleScrollGeometry, cancel: cancelScrollGeometry } = createFrameScheduler(
    () => runGeometry(false),
  );

  const onWindowEvent = (event?: Event) => {
    if (event?.type === 'scroll' || event?.type === 'scrollend') {
      scheduleScrollGeometry();
      return;
    }
    onResize();
  };

  const cleanupUpdateListener = setTourUpdateListener({
    update: onWindowEvent,
    events: ['resize', 'scroll', 'scrollend', 'orientationchange'],
    customSetListener: setUpdateListener,
    customRemoveListener: removeUpdateListener,
  });

  // Mobile browser chrome / soft keyboard — visualViewport moves independently of window.
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  const onVisualViewport = () => scheduleScrollGeometry();
  if (vv) {
    vv.addEventListener('resize', onVisualViewport);
    vv.addEventListener('scroll', onVisualViewport);
  }

  cleanupRefs.current.push(() => {
    cancelScrollGeometry();
    cleanupUpdateListener();
    if (vv) {
      vv.removeEventListener('resize', onVisualViewport);
      vv.removeEventListener('scroll', onVisualViewport);
    }
  });

  // movingTarget polling — floor interval so demos cannot set 0 / tiny values.
  if (movingTarget && (currentTarget || selector)) {
    const interval = Math.max(updateInterval || 250, 200);
    const cleanupWatcher = setTargetWatcher(conditionalUpdate, interval);
    cleanupRefs.current.push(cleanupWatcher);
  }

  if (nextOnTargetClick && currentTarget) {
    const cleanupTargetTether = setNextOnTargetClick(
      currentTarget,
      tourLogic.next,
      validateNextOnTargetClick,
    );
    cleanupRefs.current.push(cleanupTargetTether);
  }
}
