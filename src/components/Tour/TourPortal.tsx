/**
 * Portal host that paints the mask, tooltip, and tip markers into
 * the tour root (or inline until the root is known).
 */
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
  tooltipContainerStyle?: TourOptions['tooltipContainerStyle'];
  customTooltipRenderer?: TourOptions['customTooltipRenderer'];
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  maskPadding?: number;
  maskRadius?: number;
  disableMask?: boolean;
  renderMask?: TourOptions['renderMask'];
  disableTips?: boolean;
  tourLogic: TourLogic;
  steps: (TourStep & { isVisible?: boolean })[];
  currentStepIndex: number;
  goToStep: (stepIndex: number) => void;
  keyPressHandler: (event: React.KeyboardEvent) => void;
  portalRef: React.MutableRefObject<HTMLElement | undefined>;
  tooltipRef: React.MutableRefObject<HTMLElement | undefined>;
}

export function TourPortal({
  direction,
  identifier,
  zIndex,
  tourRoot,
  target,
  tooltipPosition,
  transition,
  tooltipMaxWidth,
  tooltipContainerStyle,
  customTooltipRenderer,
  disableMaskInteraction,
  disableCloseOnClick,
  maskPadding,
  maskRadius,
  disableMask,
  renderMask,
  disableTips,
  tourLogic,
  steps,
  currentStepIndex,
  goToStep,
  keyPressHandler,
  portalRef,
  tooltipRef,
}: TourPortalProps) {
  const MaskTag = renderMask ? renderMask : Mask;

  const maxWidth =
    typeof tooltipMaxWidth === 'number' ? `${tooltipMaxWidth}px` : tooltipMaxWidth || undefined;

  const content = (
    <div
      ref={portalRef as React.RefObject<HTMLDivElement>}
      id={getIdString(basePortalString, identifier)}
      className="tourara-portal"
      style={{ zIndex }}
      dir={direction}
    >
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
        <div
          ref={tooltipRef as React.RefObject<HTMLDivElement>}
          id={getIdString(baseTooltipContainerString, identifier)}
          className="tourara-tooltip-shell"
          style={{
            top: tooltipPosition?.coords.y ?? 16,
            left: tooltipPosition?.coords.x ?? 16,
            transition,
            maxWidth,
            ...tooltipContainerStyle,
          }}
          onKeyDown={keyPressHandler}
          tabIndex={0}
          dir={direction}
        >
          {customTooltipRenderer ? customTooltipRenderer(tourLogic) : <Tooltip {...tourLogic} tooltipRef={tooltipRef} />}
        </div>
      )}

      {tourRoot && !disableTips && (
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
    </div>
  );

  return tourRoot ? ReactDOM.createPortal(content, getValidPortalRoot(tourRoot)) : content;
}
