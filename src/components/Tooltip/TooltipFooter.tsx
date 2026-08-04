/**
 * Tooltip footer: skip / finish / next controls, or a custom footer renderer.
 */
import { Box, Button, IconButton, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import type { TourLogic } from '../../types';

interface TooltipFooterProps {
  tourLogic: TourLogic;
  customFooterRenderer?: TourLogic['stepContent']['customFooterRenderer'];
  stepIndex: number;
  allStepsLength: number;
  noSkipBtn?: boolean;
  doneLabel: string;
  skipLabel: string;
  prevDisabled: boolean;
  nextDisabled: boolean;
  prevAria: string;
  nextAria: string;
  prevIcon: ReactNode;
  nextIcon: ReactNode;
  close: TourLogic['close'];
  prev: TourLogic['prev'];
  next: TourLogic['next'];
}

/**
 * Sticky footer with skip/done and prev/next controls, or a custom footer renderer.
 */
export function TooltipFooter({
  tourLogic,
  customFooterRenderer,
  stepIndex,
  allStepsLength,
  noSkipBtn,
  doneLabel,
  skipLabel,
  prevDisabled,
  nextDisabled,
  prevAria,
  nextAria,
  prevIcon,
  nextIcon,
  close,
  prev,
  next,
}: TooltipFooterProps) {
  return (
    <Stack sx={{ px: { xs: 1.5, sm: 2 }, pb: 1.5, pt: 0.5, width: '100%', zIndex: 10001, position: 'sticky' }}>
      {customFooterRenderer ? (
        customFooterRenderer(tourLogic)
      ) : (
        <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="center">
          {stepIndex === allStepsLength - 1 ? (
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
  );
}
