/**
 * Guided tour orchestrator: owns step state, wires hooks, and delegates
 * mask/tooltip/tip rendering to {@link TourPortal}.
 *
 * Performance notes:
 * - Tip on-screen checks live in TipLayer (no MutationObserver on the page)
 * - Geometry settle does not rebind listeners every frame
 * - Scroll lock only while the tour is open
 */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useUpdateTour } from '../../hooks';
import { useTourStore } from '../../store/tourStore';
import type { TourProps, TourStep } from '../../types';
import type { OrientationCoords } from '../../utils/positioning';
import { lockUserScroll } from '../../utils/scrollLock';
import { buildTourLogic } from './buildTourLogic';
import { TourPortal } from './TourPortal';
import { useMergedTourOptions } from './useMergedTourOptions';
import { useTourKeyboard } from './useTourKeyboard';
import { useTourRoot } from './useTourRoot';
import { useTourStepNavigation } from './useTourStepNavigation';

export const Tour = (props: TourProps) => {
  const { initialStepIndex, isOpen, resetKey, onClose } = props;

  const [steps, setSteps] = useState<TourStep[]>(props.steps || []);
  const [target, setTarget] = React.useState<HTMLElement | undefined>(undefined);
  const [tooltipPosition, setTooltipPosition] = React.useState<OrientationCoords | undefined>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);

  const { setTourProps } = useTourStore();

  const cleanupRefs = React.useRef<Array<() => void>>([]);
  const tooltip = React.useRef<HTMLElement | undefined>(undefined);
  const portal = React.useRef<HTMLElement | undefined>(undefined);

  const currentStepContent: TourStep = steps[currentStepIndex];
  const tourOpen: boolean = isOpen || false;

  const options = useMergedTourOptions(props, currentStepContent);

  const {
    maskPadding,
    maskRadius,
    tooltipMaxWidth,
    disableMaskInteraction,
    disableCloseOnClick,
    transition,
    customTooltipRenderer,
    zIndex,
    tooltipContainerSx,
    rootSelector,
    customNextFunc,
    customPrevFunc,
    customCloseFunc,
    disableClose,
    disableNext,
    disablePrev,
    identifier,
    disableMask,
    renderMask,
    disableTips,
    direction = 'ltr',
  } = options;

  useEffect(() => {
    setSteps(props.steps);
  }, [props.steps]);

  React.useEffect(() => {
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanup = () => {
    cleanupRefs.current.forEach((f) => f());
    cleanupRefs.current = [];
  };

  const { goToStep, handleNextClick, handlePrevClick, handleSkipClick, closeTour } = useTourStepNavigation({
    steps,
    currentStepIndex,
    setCurrentStepIndex,
    onClose,
    setTourProps,
    cleanup,
    target,
  });

  const tourLogic = buildTourLogic({
    next: handleNextClick,
    skip: handleSkipClick,
    prev: handlePrevClick,
    close: closeTour,
    goToStep,
    options,
    currentStepIndex,
    steps,
    tooltipPosition,
    direction,
    customNextFunc,
    customPrevFunc,
    customCloseFunc,
  });

  const tourRoot = useTourRoot({ tourOpen, rootSelector, portalRef: portal });

  React.useEffect(() => {
    if (!tourOpen) return;
    return lockUserScroll();
  }, [tourOpen]);

  useUpdateTour({
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
  });

  useEffect(() => {
    if (resetKey === undefined) return;
    goToStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const keyPressHandler = useTourKeyboard({
    tourLogic,
    direction,
    disableClose,
    disableNext,
    disablePrev,
  });

  if (!tourOpen || !currentStepContent) {
    return null;
  }

  return (
    <TourPortal
      direction={direction}
      identifier={identifier}
      zIndex={zIndex}
      tourRoot={tourRoot}
      target={target}
      tooltipPosition={tooltipPosition}
      transition={transition}
      tooltipMaxWidth={tooltipMaxWidth}
      tooltipContainerSx={tooltipContainerSx}
      customTooltipRenderer={customTooltipRenderer}
      disableMaskInteraction={disableMaskInteraction}
      disableCloseOnClick={disableCloseOnClick}
      maskPadding={maskPadding}
      maskRadius={maskRadius}
      disableMask={disableMask}
      renderMask={renderMask}
      disableTips={disableTips}
      tourLogic={tourLogic}
      steps={steps}
      currentStepIndex={currentStepIndex}
      goToStep={goToStep}
      keyPressHandler={keyPressHandler}
      portalRef={portal}
      tooltipRef={tooltip}
    />
  );
};
