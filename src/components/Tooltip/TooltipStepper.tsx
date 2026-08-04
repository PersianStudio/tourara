/**
 * Dot stepper showing progress through the tour step list.
 */
import { Box, MobileStepper } from '@mui/material';
import * as React from 'react';
import type { TourStep } from '../../types';

interface TooltipStepperProps {
  allSteps: TourStep[];
  stepIndex: number;
}

/**
 * Dot stepper for steps that currently have a matching DOM target.
 * Recomputes the visible step list whenever `allSteps` or `stepIndex` changes.
 */
export function TooltipStepper({ allSteps, stepIndex }: TooltipStepperProps) {
  const [activePresetSteps, setActivePresetSteps] = React.useState<TourStep[]>([]);

  React.useEffect(() => {
    const activeSteps = allSteps?.filter((step) => !!window.document.querySelector(step.selector));
    setActivePresetSteps(activeSteps);
  }, [allSteps, stepIndex]);

  return (
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
  );
}
