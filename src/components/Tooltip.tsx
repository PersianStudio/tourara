import { Box, Button, Divider, IconButton, MobileStepper, Stack, Typography, type SxProps, type Theme } from '@mui/material';
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
    },
    stepIndex,
    allSteps,
    tooltipPosition,
  } = {
    ...props,
  };

  const [activePresetSteps, setActivePresetSteps] = React.useState<TourStep[]>([]);

  const [cornerStyles, setCornerStyles] = React.useState<{
    style: SxProps<Theme>;
    svgStyle: SxProps<Theme>;
  }>();

  React.useEffect(() => {
    const activeSteps = allSteps?.filter((step) => {
      return !!window.document.querySelector(step.selector);
    });
    setActivePresetSteps(activeSteps);
  }, [allSteps, stepIndex]);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let debounceTimer: any;

    const applyStyles = () => {
      const target: HTMLElement | undefined = window.document.querySelector(allSteps?.[stepIndex]?.selector) as
        | HTMLElement
        | undefined;

      const cornerStyle = getCornerStyles(tooltipPosition?.orientation, target, tooltipRef.current, corner);
      setCornerStyles(cornerStyle);
    };

    debounceTimer = setTimeout(() => {
      applyStyles();
    }, 50);

    return () => clearTimeout(debounceTimer);
  }, [tooltipPosition, stepIndex, allSteps, tooltipRef, corner]);

  const prevDisabled: boolean = stepIndex - 1 < 0;
  const nextDisabled: boolean = stepIndex + 1 >= allSteps.length;

  return (
    <Box
      sx={{
        borderRadius: (theme) => theme.spacing(tooltipBorderRadius || 4),
        position: 'relative',
        ...cornerStyles?.style,
        bgcolor: 'grey.900',
        color: 'common.white',
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
          <Box sx={{ px: 5, py: 4, width: '100%', zIndex: 10001, position: 'sticky' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                {typeof title === 'string' ? (
                  <Typography variant="h6" color="inherit" noWrap>
                    {title}
                  </Typography>
                ) : typeof title === 'function' ? (
                  title(props)
                ) : (
                  title
                )}
                {audio && <VolumeIcon style={{ fontSize: 20, opacity: 0.9 }} />}
              </Stack>

              {!noCloseIcon && (
                <IconButton onClick={() => close()} size="small" aria-label="Close tour" sx={{ color: 'inherit' }}>
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          </Box>
          <Divider variant="fullWidth" sx={{ m: 0, borderColor: 'grey.800' }} />
        </>
      )}

      <Stack sx={{ px: 5, pt: 4, width: '100%' }}>
        <Box sx={{ overflow: 'auto', maxHeight: '13vh', ...contentContainerSx }}>
          {typeof content === 'string' ? (
            <Typography variant="body1" color="inherit" sx={{ opacity: 0.92 }}>
              {content}
            </Typography>
          ) : typeof content === 'function' ? (
            content(props)
          ) : (
            content
          )}
        </Box>

        {(image || video) && (
          <Stack sx={{ pb: { xs: 3, md: 6 }, pt: { xs: 3, md: 6 } }} direction="row" spacing={2} alignItems="center">
            {video && (
              <Button
                size="small"
                startIcon={<PlayIcon style={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: 5,
                  bgcolor: 'grey.700',
                  color: 'common.white',
                  maxHeight: 32,
                  '&:hover': { bgcolor: 'grey.600' },
                }}
              >
                {videoBtnText || 'Video'}
              </Button>
            )}
            {image && (
              <Button
                size="small"
                startIcon={<ImageIcon style={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: 5,
                  bgcolor: 'grey.700',
                  color: 'common.white',
                  maxHeight: 32,
                  '&:hover': { bgcolor: 'grey.600' },
                }}
              >
                {imageBtnText || 'Image'}
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      {!noStepper && (
        <Box
          sx={{
            px: 4,
            pb: {
              xs: 3,
              md: 5,
            },
            ...(!image &&
              !video && {
                pt: { xs: 3, md: 6 },
              }),
            width: '100%',
          }}
        >
          <MobileStepper
            variant="dots"
            sx={{
              bgcolor: 'transparent',
              p: 0,
              '& .MuiMobileStepper-dot': {
                bgcolor: (theme) => theme.palette.grey[500],
                width: '6px',
                height: '6px',
              },
              '& .MuiMobileStepper-dotActive': {
                bgcolor: (theme) => theme.palette.background.paper,
                width: 40,
                borderRadius: 4,
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
        <Stack sx={{ px: 5, pb: 4, pt: { xs: 1, md: 2 }, width: '100%', zIndex: 10001, position: 'sticky' }}>
          {customFooterRenderer ? (
            customFooterRenderer(props)
          ) : (
            <Stack direction="row" justifyContent="space-between" spacing={4} alignItems="center">
              {stepIndex === allSteps.length - 1 ? (
                <Button variant="contained" size="small" onClick={() => close(true)}>
                  {finishBtnText || 'Done'}
                </Button>
              ) : noSkipBtn ? (
                <Box />
              ) : (
                <Button variant="contained" size="small" onClick={() => close(true)}>
                  {skipBtnText || 'Skip'}
                </Button>
              )}

              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  disabled={prevDisabled}
                  onClick={() => prev()}
                  aria-label="Previous step"
                  size="small"
                  sx={{
                    bgcolor: 'grey.700',
                    borderRadius: 1,
                    color: 'grey.300',
                    '&:hover': { bgcolor: 'grey.600' },
                    '&.Mui-disabled': { bgcolor: 'grey.800', color: 'grey.600' },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  disabled={nextDisabled}
                  onClick={() => next()}
                  aria-label="Next step"
                  size="small"
                  sx={{
                    bgcolor: 'grey.700',
                    borderRadius: 1,
                    color: 'grey.300',
                    '&:hover': { bgcolor: 'grey.600' },
                    '&.Mui-disabled': { bgcolor: 'grey.800', color: 'grey.600' },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
}
