/**
 * Presentational tip marker — position is decided by TipLayer.
 */
import { Box, useTheme } from '@mui/material';
import { TipIcon } from '../../icons';
import { TIP_SIZE } from './constants';

export type TipMarkerProps = {
  x: number;
  y: number;
  /** Optional: jump to this step when the marker is interactive. */
  onActivate?: () => void;
};

export function TipMarker({ x, y, onActivate }: TipMarkerProps) {
  const theme = useTheme();
  const interactive = Boolean(onActivate);

  return (
    <Box
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={
        interactive
          ? (e) => {
              e.stopPropagation();
              onActivate?.();
            }
          : undefined
      }
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onActivate?.();
              }
            }
          : undefined
      }
      sx={{
        position: 'fixed',
        top: y,
        left: x,
        width: TIP_SIZE,
        height: TIP_SIZE,
        zIndex: 10001,
        borderRadius: '50%',
        pointerEvents: interactive ? 'auto' : 'none',
        cursor: interactive ? 'pointer' : 'default',
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
