/**
 * Presentational tip marker — memoized plain HTML button.
 */
import { memo } from 'react';
import { TipIcon } from '../../icons';
import { TIP_SIZE } from './constants';

export type TipMarkerProps = {
  x: number;
  y: number;
  stepIndex: number;
  onActivate: (stepIndex: number) => void;
};

function TipMarkerInner({ x, y, stepIndex, onActivate }: TipMarkerProps) {
  return (
    <button
      type="button"
      className="tourara-tip"
      style={{ top: y, left: x, width: TIP_SIZE, height: TIP_SIZE, zIndex: 9990 }}
      onClick={(e) => {
        e.stopPropagation();
        onActivate(stepIndex);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onActivate(stepIndex);
        }
      }}
      aria-label={`Go to tour step ${stepIndex + 1}`}
    >
      <span className="tourara-tip-inner">
        <TipIcon />
      </span>
    </button>
  );
}

export const TipMarker = memo(TipMarkerInner);
