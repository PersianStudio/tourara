import { TourProps } from '../types';

export const tourDefaultProps: Partial<TourProps> = {
  direction: 'ltr',
  maskPadding: 5,
  maskRadius: 2,
  tooltipSeparation: 8,
  tooltipBorderRadius: 1,
  transition: 'top 220ms ease, left 220ms ease',
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
