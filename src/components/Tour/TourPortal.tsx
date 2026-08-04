import { Box, type SxProps, type Theme } from '@mui/material';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { baseMaskString, basePortalString, baseTooltipContainerString } from '../../constants';
import type { TourLogic, TourOptions, TourStep } from '../../types';
import { getTargetInfo, getValidPortalRoot } from '../../utils/dom';
import type { OrientationCoords } from '../../utils/positioning';
import { getIdString } from '../../utils/tour';
import { Mask } from '../Mask';
import { TipLayer } from '../Tip';
import { Tooltip } from '../Tooltip';

export interface TourPortalProps {
  direction: TourLogic['direction'];
  identifier?: string;
  zIndex?: number;
  tourRoot: Element | undefined;
  target: HTMLElement | undefined;
  tooltipPosition: OrientationCoords | undefined;
  transition?: string;
  tooltipMaxWidth?: TourOptions['tooltipMaxWidth'];
  tooltipContainerSx?: TourOptions['tooltipContainerSx'];
  customTooltipRenderer?: TourOptions['customTooltipRenderer'];
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  maskPadding?: number;
  maskRadius?: number;
  disableMask?: boolean;
  renderMask?: TourOptions['renderMask'];
  tourLogic: TourLogic;
  steps: (TourStep & { isVisible?: boolean })[];
  currentStepIndex: number;
  goToStep: (stepIndex: number) => void;
  keyPressHandler: (event: React.KeyboardEvent) => void;
  portalRef: React.MutableRefObject<HTMLElement | undefined>;
  tooltipRef: React.MutableRefObject<HTMLElement | undefined>;
}

/**
 * Portal host that paints the mask, tooltip, and tip markers into
 * the tour root (or inline until the root is known).
 */
export function TourPortal({
  direction,
  identifier,
  zIndex,
  tourRoot,
  target,
  tooltipPosition,
  transition,
  tooltipMaxWidth,
  tooltipContainerSx,
  customTooltipRenderer,
  disableMaskInteraction,
  disableCloseOnClick,
  maskPadding,
  maskRadius,
  disableMask,
  renderMask,
  tourLogic,
  steps,
  currentStepIndex,
  goToStep,
  keyPressHandler,
  portalRef,
  tooltipRef,
}: TourPortalProps) {
  const MaskTag = renderMask ? renderMask : Mask;

  const tooltipContainerStyle: SxProps<Theme> = {
    position: 'absolute',
    top: tooltipPosition?.coords.y ?? 16,
    left: tooltipPosition?.coords.x ?? 16,
    transition: transition,
    zIndex: 10000,
    pointerEvents: 'auto',
    outline: 'none',
    ...(!customTooltipRenderer && {
      maxWidth: tooltipMaxWidth || { xs: 'calc(100vw - 24px)', sm: 360, md: 400, lg: 440 },
      width: 'max-content',
      minWidth: { xs: 0, sm: 260 },
      boxSizing: 'border-box',
    }),
    ...tooltipContainerSx,
  };

  // Must cover the viewport explicitly. Absolute tooltip children do not expand
  // this box; when `disableMask` is true there is no SVG either — without size +
  // overflow:hidden the tooltip is clipped to 0×0 and appears to "do nothing".
  const portalStyle: SxProps<Theme> = {
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    width: '100vw',
    height: '100vh',
    zIndex: zIndex,
    visibility: 'visible',
    pointerEvents: 'none',
  };

  const content = (
    <Box ref={portalRef} id={getIdString(basePortalString, identifier)} sx={portalStyle} dir={direction}>
      {tourRoot && (
        <MaskTag
          maskId={getIdString(baseMaskString, identifier)}
          targetInfo={getTargetInfo(tourRoot, target)}
          disableMaskInteraction={disableMaskInteraction}
          disableCloseOnClick={disableCloseOnClick}
          padding={maskPadding || 0}
          radius={maskRadius || 0}
          tourRoot={tourRoot}
          close={tourLogic.close}
          disableMask={disableMask}
        />
      )}

      {tourRoot && (
        <Box
          ref={tooltipRef}
          id={getIdString(baseTooltipContainerString, identifier)}
          sx={tooltipContainerStyle}
          onKeyDown={keyPressHandler}
          tabIndex={0}
          dir={direction}
        >
          {customTooltipRenderer ? customTooltipRenderer(tourLogic) : <Tooltip {...tourLogic} tooltipRef={tooltipRef} />}
        </Box>
      )}

      {tourRoot && (
        <TipLayer
          steps={steps}
          currentStepIndex={currentStepIndex}
          tourRoot={tourRoot}
          direction={direction}
          goToStep={goToStep}
          activeTarget={target}
          maskPadding={maskPadding || 0}
          tooltipRef={tooltipRef}
        />
      )}
    </Box>
  );

  return tourRoot ? ReactDOM.createPortal(content, getValidPortalRoot(tourRoot)) : content;
}
