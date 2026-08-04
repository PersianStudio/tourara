/**
 * Tooltip content area — renders step content or a custom content renderer.
 */
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { TourLogic } from '../../types';

interface TooltipBodyProps {
  tourLogic: TourLogic;
  content: TourLogic['stepContent']['content'];
  contentContainerSx?: SxProps<Theme>;
}

/**
 * Scrollable step body: string content as Typography, or custom node/renderer.
 */
export function TooltipBody({ tourLogic, content, contentContainerSx }: TooltipBodyProps) {
  return (
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
        content(tourLogic)
      ) : (
        content
      )}
    </Box>
  );
}
