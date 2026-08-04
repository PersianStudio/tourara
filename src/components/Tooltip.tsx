import {
  Box,
  Button,
  Divider,
  IconButton,
  MobileStepper,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import * as React from 'react';
import { TourTooltipCorner } from '../assets/TourTooltipCorner';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ImageIcon, PlayIcon, VolumeIcon } from '../icons';
import type { TourLogic, TourStep } from '../types';
import { CardinalOrientation } from '../utils/positioning';
import { getCornerStyles } from '../utils/tooltipCorner';

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

  const [activePresetSteps, setActivePresetSteps] = React.useState<TourStep[]>([]);

  const [cornerStyles, setCornerStyles] = React.useState<{
    style: SxProps<Theme>;
    svgStyle: SxProps<Theme>;
  }>();

  React.useEffect(() => {
    const activeSteps = allSteps?.filter((step) => !!window.document.querySelector(step.selector));
    setActivePresetSteps(activeSteps);
  }, [allSteps, stepIndex]);

  React.useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    const applyStyles = () => {
      const target = window.document.querySelector(allSteps?.[stepIndex]?.selector) as HTMLElement | undefined;
      const cornerStyle = getCornerStyles(tooltipPosition?.orientation, target, tooltipRef.current, corner);
      setCornerStyles(cornerStyle);
    };

    debounceTimer = setTimeout(applyStyles, 50);
    return () => clearTimeout(debounceTimer);
  }, [tooltipPosition, stepIndex, allSteps, tooltipRef, corner]);

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
      {title && (
        <>
          <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.25, width: '100%', zIndex: 10001, position: 'sticky' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                {typeof title === 'string' ? (
                  <Typography
                    variant="subtitle1"
                    color="inherit"
                    noWrap
                    sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
                  >
                    {title}
                  </Typography>
                ) : typeof title === 'function' ? (
                  title(props)
                ) : (
                  title
                )}
                {audio && <VolumeIcon style={{ fontSize: 18, opacity: 0.9, flexShrink: 0 }} />}
              </Stack>

              {!noCloseIcon && (
                <IconButton onClick={() => close()} size="small" aria-label={closeAria} sx={{ color: 'inherit', p: 0.5 }}>
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          </Box>
          <Divider variant="fullWidth" sx={{ m: 0, borderColor: 'grey.800' }} />
        </>
      )}

      <Stack sx={{ px: { xs: 1.5, sm: 2 }, pt: 1.25, width: '100%' }}>
        <Box
          sx={{
            overflow: 'auto',
            maxHeight: { xs: '28vh', sm: '22vh', md: '18vh' },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            lineHeight: 1.5,
            ...contentContainerSx,
          }}
        >
          {typeof content === 'string' ? (
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.92, lineHeight: 1.55 }}>
              {content}
            </Typography>
          ) : typeof content === 'function' ? (
            content(props)
          ) : (
            content
          )}
        </Box>

        {(image || video) && (
          <Stack sx={{ py: 1.25 }} direction="row" spacing={1} alignItems="center">
            {video && (
              <Button
                size="small"
                startIcon={<PlayIcon style={{ fontSize: 14 }} />}
                sx={{
                  borderRadius: 1,
                  bgcolor: 'grey.700',
                  color: 'common.white',
                  maxHeight: 30,
                  '&:hover': { bgcolor: 'grey.600' },
                }}
              >
                {videoLabel}
              </Button>
            )}
            {image && (
              <Button
                size="small"
                startIcon={<ImageIcon style={{ fontSize: 14 }} />}
                sx={{
                  borderRadius: 1,
                  bgcolor: 'grey.700',
                  color: 'common.white',
                  maxHeight: 30,
                  '&:hover': { bgcolor: 'grey.600' },
                }}
              >
                {imageLabel}
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      {!noStepper && (
        <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 1, pt: 1.25, width: '100%' }}>
          <MobileStepper
            variant="dots"
            sx={{
              bgcolor: 'transparent',
              p: 0,
              '& .MuiMobileStepper-dot': {
                bgcolor: (theme) => theme.palette.grey[500],
                width: 6,
                height: 6,
              },
              '& .MuiMobileStepper-dotActive': {
                bgcolor: (theme) => theme.palette.warning.main,
                width: 28,
                borderRadius: 1,
              },
            }}
            steps={activePresetSteps?.length || 0}
            position="static"
            activeStep={activePresetSteps?.findIndex((step) => step.selector === allSteps?.[stepIndex]?.selector) || 0}
            backButton={<span />}
            nextButton={<span />}
          />
        </Box>
      )}
      {!noFooter && (
        <Stack sx={{ px: { xs: 1.5, sm: 2 }, pb: 1.5, pt: 0.5, width: '100%', zIndex: 10001, position: 'sticky' }}>
          {customFooterRenderer ? (
            customFooterRenderer(props)
          ) : (
            <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="center">
              {stepIndex === allSteps.length - 1 ? (
                <Button variant="contained" size="small" onClick={() => close(true)} sx={{ borderRadius: 1 }}>
                  {doneLabel}
                </Button>
              ) : noSkipBtn ? (
                <Box />
              ) : (
                <Button variant="contained" size="small" onClick={() => close(true)} sx={{ borderRadius: 1 }}>
                  {skipLabel}
                </Button>
              )}

              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  disabled={prevDisabled}
                  onClick={() => prev()}
                  aria-label={prevAria}
                  size="small"
                  sx={{
                    bgcolor: 'grey.700',
                    borderRadius: 1,
                    color: 'grey.300',
                    '&:hover': { bgcolor: 'grey.600' },
                    '&.Mui-disabled': { bgcolor: 'grey.800', color: 'grey.600' },
                  }}
                >
                  {prevIcon}
                </IconButton>
                <IconButton
                  disabled={nextDisabled}
                  onClick={() => next()}
                  aria-label={nextAria}
                  size="small"
                  sx={{
                    bgcolor: 'grey.700',
                    borderRadius: 1,
                    color: 'grey.300',
                    '&:hover': { bgcolor: 'grey.600' },
                    '&.Mui-disabled': { bgcolor: 'grey.800', color: 'grey.600' },
                  }}
                >
                  {nextIcon}
                </IconButton>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
}
