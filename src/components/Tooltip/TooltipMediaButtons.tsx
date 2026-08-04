/**
 * Optional video / image action buttons rendered inside the tooltip body area.
 */
import { ImageIcon, PlayIcon } from '../../icons';

interface TooltipMediaButtonsProps {
  video?: boolean;
  image?: boolean;
  videoLabel: string;
  imageLabel: string;
}

export function TooltipMediaButtons({ video, image, videoLabel, imageLabel }: TooltipMediaButtonsProps) {
  if (!image && !video) {
    return null;
  }

  return (
    <div className="tourara-tooltip-media">
      {video && (
        <button type="button" className="tourara-btn tourara-btn-ghost">
          <PlayIcon style={{ fontSize: 14 }} />
          {videoLabel}
        </button>
      )}
      {image && (
        <button type="button" className="tourara-btn tourara-btn-ghost">
          <ImageIcon style={{ fontSize: 14 }} />
          {imageLabel}
        </button>
      )}
    </div>
  );
}
