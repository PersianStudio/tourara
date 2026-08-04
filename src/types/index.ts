import type { SxProps, Theme } from '@mui/material';
import type { ReactElement, ReactNode } from 'react';
import type { MaskOptions } from '../components/Mask';
import type { CardinalOrientation, OrientationCoords } from '../utils/positioning';

export interface TourLogic {
  next: (fromTarget?: boolean) => void;
  skip: (fromTarget?: boolean) => void;
  prev: () => void;
  close: (reset?: boolean) => void;
  goToStep: (stepNumber: number) => void;
  stepContent: TourStep;
  stepIndex: number;
  allSteps: TourStep[];
  tooltipPosition: OrientationCoords | undefined;
}

export interface TourOptions {
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  orientationPreferences?: CardinalOrientation[];
  tipOrientationPreferences?: CardinalOrientation[];
  tooltipMaxWidth?: string | number | { xs: number; sm: number; md: number; lg: number; xl: number };
  maskPadding?: number;
  maskRadius?: number;
  tooltipBorderRadius?: number;
  tooltipSeparation?: number;
  noFooter?: boolean;
  noCloseIcon?: boolean;
  noSkipBtn?: boolean;
  finishBtnText?: string;
  skipBtnText?: string;
  videoBtnText?: string;
  imageBtnText?: string;
  noStepper?: boolean;
  transition?: string;
  contentContainerSx?: SxProps<Theme>;
  corner?: 'none' | 'small';
  tooltipContainerSx?: SxProps<Theme>;
  customTitleRenderer?: (tourLogic?: TourLogic) => ReactNode;
  customContentRenderer?: (tourLogic?: TourLogic) => ReactNode;
  customFooterRenderer?: (tourLogic?: TourLogic) => ReactNode;
  customTooltipRenderer?: (tourLogic?: TourLogic) => ReactNode;
  customNextFunc?: (tourLogic: TourLogic, fromTarget?: boolean) => Promise<void>;
  customPrevFunc?: (tourLogic: TourLogic) => Promise<void>;
  customCloseFunc?: (tourLogic: TourLogic) => Promise<void>;
  prevLabel?: string;
  nextLabel?: string;
  closeLabel?: string;
  disableNext?: boolean;
  disablePrev?: boolean;
  disableClose?: boolean;
  disableAutoScroll?: boolean;
  getPositionFromCandidates?: (candidates: OrientationCoords[]) => OrientationCoords;
  movingTarget?: boolean;
  updateInterval?: number;
  renderTolerance?: number;
  disableMask?: boolean;
  renderMask?: (maskOptions: MaskOptions) => ReactElement;
  disableSmoothScroll?: boolean;
  allowForeignTarget?: boolean;
  nextOnTargetClick?: boolean;
  validateNextOnTargetClick?: () => Promise<boolean>;
}

export interface TourStep extends TourOptions {
  selector: string;
  title?: ((tourLogic?: TourLogic) => ReactNode) | ReactNode;
  content: ((tourLogic?: TourLogic) => ReactNode) | ReactNode;
  audio?: boolean;
  video?: boolean;
  image?: boolean;
}

export interface TourProps extends TourOptions {
  steps: TourStep[];
  initialStepIndex?: number;
  zIndex?: number;
  rootSelector?: string;
  identifier?: string;
  setUpdateListener?: (update: () => void) => void;
  removeUpdateListener?: (update: () => void) => void;
  disableListeners?: boolean;
  isOpen?: boolean;
  /**
   * When this value changes, the tour jumps back to step 0.
   * Use a route pathname (or similar) instead of depending on react-router.
   */
  resetKey?: string | number;
  /** Controlled close handler. Prefer this over the store when using `<Tour />` directly. */
  onClose?: (reset?: boolean) => void;
}
