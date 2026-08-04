/**
 * Default `<Tour />` option values applied when callers omit fields.
 */
import { TourProps } from '../types';

export const tourDefaultProps: Partial<TourProps> = {
  direction: 'ltr',
  maskPadding: 5,
  maskRadius: 2,
  tooltipSeparation: 10,
  tooltipBorderRadius: 8,
  transition: 'top 160ms ease, left 160ms ease',
  disableMaskInteraction: false,
  disableCloseOnClick: false,
  allowForeignTarget: true,
  zIndex: 10000,
  renderTolerance: 2,
  updateInterval: 500,
  isOpen: false,
  corner: 'small',
};

export const basePortalString: string = 'tour-portal';
export const baseMaskString: string = 'tour-mask';
export const baseTooltipContainerString: string = 'tour-tooltip-container';
