/**
 * Tooltip footer: skip / finish / next controls, or a custom footer renderer.
 */
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
    <div className="tourara-tooltip-footer">
      {customFooterRenderer ? (
        customFooterRenderer(tourLogic)
      ) : (
        <>
          {stepIndex === allStepsLength - 1 ? (
            <button type="button" className="tourara-btn tourara-btn-primary" onClick={() => close(true)}>
              {doneLabel}
            </button>
          ) : noSkipBtn ? (
            <span />
          ) : (
            <button type="button" className="tourara-btn tourara-btn-primary" onClick={() => close(true)}>
              {skipLabel}
            </button>
          )}

          <div className="tourara-tooltip-nav">
            <button
              type="button"
              className="tourara-icon-btn"
              disabled={prevDisabled}
              onClick={() => prev()}
              aria-label={prevAria}
            >
              {prevIcon}
            </button>
            <button
              type="button"
              className="tourara-icon-btn"
              disabled={nextDisabled}
              onClick={() => next()}
              aria-label={nextAria}
            >
              {nextIcon}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
