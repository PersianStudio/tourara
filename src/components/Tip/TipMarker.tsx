/**
 * Presentational tip marker — memoized so TipLayer can recompute placement
 * without rewriting every marker DOM node when only one tip moved.
 */
import { Box, useTheme } from '@mui/material';
import { memo } from 'react';
import { TipIcon } from '../../icons';
import { TIP_SIZE } from './constants';

export type TipMarkerProps = {
  x: number;
  y: number;
  stepIndex: number;
  /** Stable handler — receives step index (avoids per-tip closures breaking memo). */
  onActivate: (stepIndex: number) => void;
};

function TipMarkerInner({ x, y, stepIndex, onActivate }: TipMarkerProps) {
  const theme = useTheme();

  return (
    <Box
      role="button"
      tabIndex={0}
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
      sx={{
        position: 'fixed',
        top: y,
        left: x,
        width: TIP_SIZE,
        height: TIP_SIZE,
        zIndex: 10001,
        borderRadius: '50%',
        pointerEvents: 'auto',
        cursor: 'pointer',
        bgcolor: 'grey.900',
        border: '2px solid',
        borderColor: 'grey.900',
        boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
      }}
    >
      <Box
        sx={{
          borderRadius: '50%',
          bgcolor: theme.palette.primary.main,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.primary.contrastText,
        }}
      >
        <TipIcon />
      </Box>
    </Box>
  );
}

export const TipMarker = memo(TipMarkerInner);
