/**
 * Dot stepper showing progress through the tour step list.
 */
import * as React from 'react';
import type { TourStep } from '../../types';

interface TooltipStepperProps {
  allSteps: TourStep[];
  stepIndex: number;
}

export function TooltipStepper({ allSteps, stepIndex }: TooltipStepperProps) {
  const [activePresetSteps, setActivePresetSteps] = React.useState<TourStep[]>([]);

  React.useEffect(() => {
    const activeSteps = allSteps?.filter((step) => !!window.document.querySelector(step.selector));
    setActivePresetSteps(activeSteps);
  }, [allSteps, stepIndex]);

  const activeIndex =
    activePresetSteps?.findIndex((step) => step.selector === allSteps?.[stepIndex]?.selector) || 0;
  const count = activePresetSteps?.length || 0;

  if (count <= 0) return null;

  return (
    <div className="tourara-tooltip-stepper" role="progressbar" aria-valuenow={activeIndex + 1} aria-valuemax={count}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`tourara-tooltip-dot${i === activeIndex ? ' is-active' : ''}`} />
      ))}
    </div>
  );
}
