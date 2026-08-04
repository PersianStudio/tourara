/**
 * Optional video / image action buttons rendered inside the tooltip body area.
 */
import { Button, Stack } from '@mui/material';
import { ImageIcon, PlayIcon } from '../../icons';

interface TooltipMediaButtonsProps {
  video?: boolean;
  image?: boolean;
  videoLabel: string;
  imageLabel: string;
}

/**
 * Optional video / image action buttons shown under the step body.
 */
export function TooltipMediaButtons({ video, image, videoLabel, imageLabel }: TooltipMediaButtonsProps) {
  if (!image && !video) {
    return null;
  }

  return (
    <Stack sx={{ py: 1.25 }} direction="row" spacing={1} alignItems="center">
      {video && (
        <Button
          size="small"
          startIcon={<PlayIcon style={{ fontSize: 14 }} />}
          sx={{
            borderRadius: 1,
            bgcolor: 'grey.700',
            color: 'common.white',
            maxHeight: 30,
            '&:hover': { bgcolor: 'grey.600' },
          }}
        >
          {videoLabel}
        </Button>
      )}
      {image && (
        <Button
          size="small"
          startIcon={<ImageIcon style={{ fontSize: 14 }} />}
          sx={{
            borderRadius: 1,
            bgcolor: 'grey.700',
            color: 'common.white',
            maxHeight: 30,
            '&:hover': { bgcolor: 'grey.600' },
          }}
        >
          {imageLabel}
        </Button>
      )}
    </Stack>
  );
}
