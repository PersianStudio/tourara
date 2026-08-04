/**
 * Tooltip title row with optional audio control and close button.
 */
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

export function TooltipHeader({ tourLogic, title, audio, noCloseIcon, closeAria, close }: TooltipHeaderProps) {
  if (!title) {
    return null;
  }

  return (
    <>
      <div className="tourara-tooltip-header">
        <div className="tourara-tooltip-header-main">
          {typeof title === 'string' ? (
            <h2 className="tourara-tooltip-title">{title}</h2>
          ) : typeof title === 'function' ? (
            title(tourLogic)
          ) : (
            title
          )}
          {audio && <VolumeIcon style={{ fontSize: 18, opacity: 0.9, flexShrink: 0 }} />}
        </div>

        {!noCloseIcon && (
          <button
            type="button"
            className="tourara-icon-btn is-plain"
            onClick={() => close()}
            aria-label={closeAria}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <hr className="tourara-tooltip-divider" />
    </>
  );
}
