/**
 * Tooltip title row with optional audio control and close button.
 */
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { CloseIcon, VolumeIcon } from '../../icons';
import type { TourLogic } from '../../types';

interface TooltipHeaderProps {
  tourLogic: TourLogic;
  title: TourLogic['stepContent']['title'];
  audio?: boolean;
  noCloseIcon?: boolean;
  closeAria: string;
  close: TourLogic['close'];
}

/**
 * Sticky title row with optional audio indicator and close button.
 * Renders a divider beneath the header when a title is present.
 */
export function TooltipHeader({ tourLogic, title, audio, noCloseIcon, closeAria, close }: TooltipHeaderProps) {
  if (!title) {
    return null;
  }

  return (
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
              title(tourLogic)
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
  );
}
