import { Box, type SxProps, type Theme } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { baseMaskString, basePortalString, baseTooltipContainerString, tourDefaultProps } from '../constants';
import { useDetectVisibility, useUpdateTour } from '../hooks';
import { useTourStore } from '../store/tourStore';
import type { TourLogic, TourOptions, TourProps, TourStep } from '../types';
import {
  getTargetInfo,
  getValidPortalRoot,
  getNearestScrollAncestor as utilGetNearestScrollAncestor,
} from '../utils/dom';
import type { OrientationCoords } from '../utils/positioning';
import { getIdString } from '../utils/tour';
import { Mask } from './Mask';
import { Tip } from './Tip';
import { Tooltip } from './Tooltip';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNearestScrollAncestor = utilGetNearestScrollAncestor as any;

export const Tour = (props: TourProps) => {
  const { initialStepIndex, isOpen, resetKey, onClose } = props;

  const [steps, setSteps] = useState<(TourStep & { isVisible?: boolean })[]>(
    props.steps.map((step) => ({ ...step, isVisible: false })) || [],
  );
  const [target, setTarget] = React.useState<HTMLElement | undefined>(undefined);
  const [tooltipPosition, setTooltipPosition] = React.useState<OrientationCoords | undefined>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);
  const [tourRoot, setTourRoot] = React.useState<Element | undefined>(undefined);

  const { setTourProps } = useTourStore();

  const cleanupRefs = React.useRef<Array<() => void>>([]);
  const tooltip = React.useRef<HTMLElement | undefined>(undefined);
  const portal = React.useRef<HTMLElement | undefined>(undefined);

  const currentStepContent: TourStep = steps[currentStepIndex];
  const tourOpen: boolean = isOpen || false;

  const options: TourOptions & TourProps & TourStep = {
    ...tourDefaultProps,
    ...props,
    ...currentStepContent,
  };

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
    corner,
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
  } = options;

  useEffect(() => {
    setSteps(props.steps);
  }, [props.steps]);

  React.useEffect(() => {
    return cleanup;
  }, []);

  const cleanup = () => {
    cleanupRefs.current.forEach((f) => f());
    cleanupRefs.current = [];
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= steps.length || stepIndex < 0) {
      return;
    }
    setCurrentStepIndex(stepIndex);
  };

  const checkTargetVisibility = (stepIndex: number) => {
    return !!window.document.querySelector(steps?.[stepIndex]?.selector);
  };

  let nextCounter = currentStepIndex + 1;

  function handleNextClick() {
    const isPresent = checkTargetVisibility(nextCounter);
    if (nextCounter < steps.length && !isPresent) {
      nextCounter = nextCounter + 1;
      handleNextClick();
    }

    if (nextCounter < steps.length) {
      goToStep(nextCounter);
    }
  }

  let skipCounter = currentStepIndex + 1;
  let skipExtraCounter = skipCounter + 1;

  function handleSkipClick() {
    const isPresent = checkTargetVisibility(skipCounter);
    if (skipCounter < steps.length && !isPresent) {
      skipCounter = skipCounter + 1;
      handleSkipClick();
    }

    if (skipExtraCounter < steps.length && !isPresent) {
      skipExtraCounter = skipExtraCounter + 1;
      handleSkipClick();
    }

    if (skipExtraCounter < steps.length) {
      goToStep(skipExtraCounter);
    }
  }

  let prevCounter = currentStepIndex - 1;

  function handlePrevClick() {
    const isPresent = checkTargetVisibility(prevCounter);

    if (prevCounter >= 0 && !isPresent) {
      prevCounter = prevCounter - 1;
      handlePrevClick();
    }

    if (prevCounter >= 0) {
      goToStep(prevCounter);
    }
  }

  const closeTour = (reset?: boolean) => {
    if (reset) {
      goToStep(0);
    }

    if (onClose) {
      onClose(reset);
    } else {
      setTourProps({ isOpen: false });
    }
    cleanup();
    target?.focus();
  };

  const baseLogic: TourLogic = {
    next: handleNextClick,
    skip: handleSkipClick,
    prev: handlePrevClick,
    close: (reset?: boolean) => closeTour(reset),
    goToStep: goToStep,
    stepContent: { ...options },
    stepIndex: currentStepIndex,
    allSteps: steps,
    tooltipPosition,
  };

  const tourLogic: TourLogic = {
    ...baseLogic,
    ...(customNextFunc && {
      next: (fromTarget?: boolean) => {
        customNextFunc(baseLogic, fromTarget);
      },
    }),
    ...(customPrevFunc && {
      prev: () => {
        customPrevFunc(baseLogic);
      },
    }),
    ...(customCloseFunc && {
      close: () => {
        customCloseFunc(baseLogic);
      },
    }),
  };

  React.useEffect(() => {
    if (!tourOpen) {
      setTourRoot(undefined);
      return;
    }

    let root = rootSelector ? document.querySelector(rootSelector) : undefined;

    if (!root) {
      root = getNearestScrollAncestor(portal.current) || document.body;
    }

    if (root && root !== tourRoot) {
      setTourRoot(root as Element);
    }
  }, [rootSelector, tourOpen]);

  // Ensure tourRoot resolves on the first open frame even before portal ref exists.
  React.useLayoutEffect(() => {
    if (!tourOpen || tourRoot) return;
    const root =
      (rootSelector ? document.querySelector(rootSelector) : null) ||
      getNearestScrollAncestor(portal.current) ||
      document.body;
    setTourRoot(root as Element);
  }, [tourOpen, tourRoot, rootSelector]);

  React.useEffect(() => {
    if (tourOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [tourOpen]);

  const { updateTour } = useUpdateTour({
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

  void updateTour;

  useDetectVisibility({
    selectors: steps.map((step) => step.selector),
    onVisible: (selector) => {
      if (!isOpen) return;
      setSteps((perv) => [
        ...perv.map((step) => {
          if (step.selector === selector) {
            return { ...step, isVisible: true };
          }
          return step;
        }),
      ]);
    },
    onHidden: (selector) => {
      if (!isOpen) return;
      setSteps((perv) => [
        ...perv.map((step) => {
          if (step.selector === selector) {
            return { ...step, isVisible: false };
          }
          return step;
        }),
      ]);
    },
    root: tourRoot,
  });

  useEffect(() => {
    if (resetKey === undefined) return;
    goToStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  if (!tourOpen || !currentStepContent) {
    return null;
  }

  const MaskTag = renderMask ? renderMask : Mask;

  const keyPressHandler = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        if (!disableClose) {
          tourLogic.close();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (!disableNext) {
          tourLogic.next();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (!disablePrev) {
          tourLogic.prev();
        }
        break;
    }
  };

  const tooltipContainerStyle: SxProps<Theme> = {
    position: 'absolute',
    top: tooltipPosition?.coords.y ?? 24,
    left: tooltipPosition?.coords.x ?? 24,
    transition: transition,
    zIndex: 10000,
    pointerEvents: 'auto',
    outline: 'none',
    ...(!customTooltipRenderer && {
      maxWidth: tooltipMaxWidth || { xs: 300, sm: 430, md: 480, lg: 530, xl: 580 },
      width: '100%',
      ...(!(corner === 'none') && {
        px: tourLogic.stepContent.corner === 'small' ? 7.5 : 0,
        py: tourLogic.stepContent.corner === 'small' ? 3.75 : 0,
      }),
    }),
    ...tooltipContainerSx,
  };

  // Must cover the viewport explicitly. Absolute tooltip children do not expand
  // this box; when `disableMask` is true there is no SVG either — without size +
  // overflow:hidden the tooltip is clipped to 0×0 and appears to "do nothing".
  const portalStyle: SxProps<Theme> = {
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    width: '100vw',
    height: '100vh',
    zIndex: zIndex,
    visibility: 'visible',
    pointerEvents: 'none',
  };

  const render = () => (
    <Box ref={portal} id={getIdString(basePortalString, identifier)} sx={portalStyle}>
      {tourRoot && (
        <MaskTag
          maskId={getIdString(baseMaskString, identifier)}
          targetInfo={getTargetInfo(tourRoot, target)}
          disableMaskInteraction={disableMaskInteraction}
          disableCloseOnClick={disableCloseOnClick}
          padding={maskPadding || 0}
          radius={maskRadius || 0}
          tourRoot={tourRoot}
          close={tourLogic.close}
          disableMask={disableMask}
        />
      )}

      {tourRoot && (
        <Box
          ref={tooltip}
          id={getIdString(baseTooltipContainerString, identifier)}
          sx={tooltipContainerStyle}
          onKeyDown={keyPressHandler}
          tabIndex={0}
        >
          {customTooltipRenderer ? customTooltipRenderer(tourLogic) : <Tooltip {...tourLogic} tooltipRef={tooltip} />}
        </Box>
      )}

      {tourRoot &&
        steps.map((step, index) => (
          <Tip
            key={index}
            step={step}
            index={index}
            isVisible={step.isVisible}
            goToStep={goToStep}
            activeIndex={currentStepIndex}
            containerRoot={tourRoot}
          />
        ))}
    </Box>
  );

  return tourRoot ? ReactDOM.createPortal(render(), getValidPortalRoot(tourRoot)) : render();
};
