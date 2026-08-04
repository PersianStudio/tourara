/**
 * Active-step tooltip chrome: header, body, footer, optional corner graphic,
 * and prev/next affordances positioned from tour logic.
 */
import { Box, Stack } from '@mui/material';
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

/**
 * Tour step tooltip shell: corner graphic, header, body, media, stepper, and footer.
 * Composes smaller presentational pieces; RTL flips chevrons and text alignment.
 */
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
      contentContainerSx,
      prevLabel,
      nextLabel,
      closeLabel,
    },
    stepIndex,
    allSteps,
    tooltipPosition,
  } = {
    ...props,
  };

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

  const prevDisabled: boolean = stepIndex - 1 < 0;
  const nextDisabled: boolean = stepIndex + 1 >= allSteps.length;
  const radius = tooltipBorderRadius ?? 1;

  return (
    <Box
      dir={direction}
      sx={{
        borderRadius: radius,
        position: 'relative',
        ...cornerStyles?.style,
        bgcolor: 'grey.900',
        color: 'common.white',
        maxWidth: '100%',
        textAlign: isRtl ? 'right' : 'left',
      }}
    >
      {!(corner === 'none') &&
        tooltipPosition?.orientation &&
        tooltipPosition.orientation !== CardinalOrientation.CENTER &&
        tooltipPosition.orientation !== CardinalOrientation.EAST &&
        tooltipPosition.orientation !== CardinalOrientation.NORTH &&
        tooltipPosition.orientation !== CardinalOrientation.SOUTH &&
        tooltipPosition.orientation !== CardinalOrientation.WEST && (
          <Box
            sx={{
              position: 'absolute',
              zIndex: 10000,
              '& svg>path': { fill: (theme) => `${theme.palette.grey[900]} !important` },
              ...cornerStyles?.svgStyle,
            }}
          >
            <TourTooltipCorner />
          </Box>
        )}

      <TooltipHeader
        tourLogic={props}
        title={title}
        audio={audio}
        noCloseIcon={noCloseIcon}
        closeAria={closeAria}
        close={close}
      />

      <Stack sx={{ px: { xs: 1.5, sm: 2 }, pt: 1.25, width: '100%' }}>
        <TooltipBody tourLogic={props} content={content} contentContainerSx={contentContainerSx} />
        <TooltipMediaButtons video={video} image={image} videoLabel={videoLabel} imageLabel={imageLabel} />
      </Stack>

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
    </Box>
  );
}
