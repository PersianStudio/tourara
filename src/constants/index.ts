import { TourProps } from '../types';

export const tourDefaultProps: Partial<TourProps> = {
  maskPadding: 5,
  maskRadius: 2,
  tooltipSeparation: 0,
  transition: 'top 300ms ease, left 300ms ease',
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
