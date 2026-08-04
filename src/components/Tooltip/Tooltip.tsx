/**
 * Active-step tooltip chrome with a geometry-aligned caret that points
 * exactly at the spotlight focus border.
 */
import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import type { TourLogic } from '../../types';
import { CardinalOrientation } from '../../utils/positioning';
import { TooltipBody } from './TooltipBody';
import { TooltipFooter } from './TooltipFooter';
import { TooltipHeader } from './TooltipHeader';
import { TooltipMediaButtons } from './TooltipMediaButtons';
import { TooltipPointer } from './TooltipPointer';
import { TooltipStepper } from './TooltipStepper';
import { useTooltipPointer } from './useTooltipPointer';

interface TooltipProps extends TourLogic {
  tooltipRef: React.MutableRefObject<HTMLElement | undefined>;
}

export function Tooltip(props: TooltipProps) {
  const {
    next,
    prev,
    close,
    direction = 'ltr',
    stepContent: {
      title,
      customFooterRenderer,
      content,
      noSkipBtn,
      finishBtnText,
      skipBtnText,
      videoBtnText,
      imageBtnText,
      audio,
      video,
      image,
      tooltipBorderRadius,
      noFooter,
      noCloseIcon,
      noStepper,
      corner,
      contentContainerStyle,
      prevLabel,
      nextLabel,
      closeLabel,
      maskPadding,
      tooltipSeparation,
    },
    stepIndex,
    allSteps,
    tooltipPosition,
  } = props;

  // Measure the card itself (not the positioned shell) so caret offsets match.
  const cardRef = React.useRef<HTMLDivElement>(null);

  const isRtl = direction === 'rtl';
  const prevIcon = isRtl ? <ChevronRightIcon /> : <ChevronLeftIcon />;
  const nextIcon = isRtl ? <ChevronLeftIcon /> : <ChevronRightIcon />;
  const prevAria = prevLabel || 'Previous step';
  const nextAria = nextLabel || 'Next step';
  const closeAria = closeLabel || 'Close tour';
  const doneLabel = finishBtnText || 'Done';
  const skipLabel = skipBtnText || 'Skip';
  const videoLabel = videoBtnText || 'Video';
  const imageLabel = imageBtnText || 'Image';

  const pointer = useTooltipPointer({
    tooltipPosition,
    stepIndex,
    allSteps,
    cardRef,
    corner,
    maskPadding,
    tooltipSeparation,
  });

  const prevDisabled = stepIndex - 1 < 0;
  const nextDisabled = stepIndex + 1 >= allSteps.length;
  const radius = tooltipBorderRadius ?? 8;

  const showPointer =
    corner !== 'none' &&
    pointer &&
    tooltipPosition?.orientation &&
    tooltipPosition.orientation !== CardinalOrientation.CENTER;

  return (
    <div ref={cardRef} className="tourara-tooltip" dir={direction} style={{ borderRadius: radius }}>
      {showPointer && pointer ? <TooltipPointer placement={pointer} /> : null}

      <TooltipHeader
        tourLogic={props}
        title={title}
        audio={audio}
        noCloseIcon={noCloseIcon}
        closeAria={closeAria}
        close={close}
      />

      <div className="tourara-tooltip-body-wrap">
        <TooltipBody tourLogic={props} content={content} contentContainerStyle={contentContainerStyle} />
        <TooltipMediaButtons video={video} image={image} videoLabel={videoLabel} imageLabel={imageLabel} />
      </div>

      {!noStepper && <TooltipStepper allSteps={allSteps} stepIndex={stepIndex} />}

      {!noFooter && (
        <TooltipFooter
          tourLogic={props}
          customFooterRenderer={customFooterRenderer}
          stepIndex={stepIndex}
          allStepsLength={allSteps.length}
          noSkipBtn={noSkipBtn}
          doneLabel={doneLabel}
          skipLabel={skipLabel}
          prevDisabled={prevDisabled}
          nextDisabled={nextDisabled}
          prevAria={prevAria}
          nextAria={nextAria}
          prevIcon={prevIcon}
          nextIcon={nextIcon}
          close={close}
          prev={prev}
          next={next}
        />
      )}
    </div>
  );
}
