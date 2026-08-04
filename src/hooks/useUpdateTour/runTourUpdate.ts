/**
 * @deprecated Prefer applyTourGeometry + bindTourListeners.
 * Kept so any lingering imports keep typechecking; delegates to the split path.
 */

import type { Coords } from '../../utils/dom';
import { applyTourGeometry } from './applyTourGeometry';
import { bindTourListeners } from './bindTourListeners';
import type { RunTourUpdateArgs } from './runTourUpdate.types';

export type { RunTourUpdateArgs } from './runTourUpdate.types';

export function runTourUpdate(args: RunTourUpdateArgs): void {
  args.cleanup();
  const currentTarget = applyTourGeometry({
    ...args,
    allowScroll: true,
  });

  const tooltipCoordsRef = { current: args.targetPosition.current ?? undefined } as {
    current: Coords | undefined;
  };

  bindTourListeners({
    ...args,
    currentTarget,
    tooltipCoordsRef,
  });
}
