/**
 * Tooltip content area — renders step content or a custom content renderer.
 */
import type { CSSProperties } from 'react';
import type { TourLogic } from '../../types';

interface TooltipBodyProps {
  tourLogic: TourLogic;
  content: TourLogic['stepContent']['content'];
  contentContainerStyle?: CSSProperties;
}

export function TooltipBody({ tourLogic, content, contentContainerStyle }: TooltipBodyProps) {
  return (
    <div className="tourara-tooltip-body" style={contentContainerStyle}>
      {typeof content === 'string' ? (
        <p>{content}</p>
      ) : typeof content === 'function' ? (
        content(tourLogic)
      ) : (
        content
      )}
    </div>
  );
}
