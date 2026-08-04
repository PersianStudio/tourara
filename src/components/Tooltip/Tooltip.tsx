/**
 * Active-step tooltip chrome: header, body, footer, optional corner graphic.
 * Plain HTML + CSS — no MUI.
 */
import * as React from 'react';
import { TourTooltipCorner } from '../../assets/TourTooltipCorner';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import type { TourLogic } from '../../types';
import { CardinalOrientation } from '../../utils/positioning';
import { TooltipBody } from './TooltipBody';
import { TooltipFooter } from './TooltipFooter';
import { TooltipHeader } from './TooltipHeader';
import { TooltipMediaButtons } from './TooltipMediaButtons';
import { TooltipStepper } from './TooltipStepper';
import { useTooltipCornerStyles } from './useTooltipCornerStyles';

interface TooltipProps extends TourLogic {
  tooltipRef: React.MutableRefObject<HTMLElement | undefined>;
}

export function Tooltip(props: TooltipProps) {
  const {
    next,
    prev,
    close,
    tooltipRef,
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
    },
    stepIndex,
    allSteps,
    tooltipPosition,
  } = props;

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

  const cornerStyles = useTooltipCornerStyles({
    tooltipPosition,
    stepIndex,
    allSteps,
    tooltipRef,
    corner,
  });

  const prevDisabled = stepIndex - 1 < 0;
  const nextDisabled = stepIndex + 1 >= allSteps.length;
  const radius = tooltipBorderRadius ?? 8;

  return (
    <div
      className="tourara-tooltip"
      dir={direction}
      style={{
        borderRadius: radius,
        ...cornerStyles?.style,
      }}
    >
      {!(corner === 'none') &&
        tooltipPosition?.orientation &&
        tooltipPosition.orientation !== CardinalOrientation.CENTER &&
        tooltipPosition.orientation !== CardinalOrientation.EAST &&
        tooltipPosition.orientation !== CardinalOrientation.NORTH &&
        tooltipPosition.orientation !== CardinalOrientation.SOUTH &&
        tooltipPosition.orientation !== CardinalOrientation.WEST && (
          <div className="tourara-tooltip-corner" style={cornerStyles?.svgStyle}>
            <TourTooltipCorner />
          </div>
        )}

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
