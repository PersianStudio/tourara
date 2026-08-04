/**
 * Tour runtime helpers: debounce, focus trap, layout-change listeners, and
 * should-update checks. Barrel re-exports the former `utils/tour.ts` API.
 */

export { debounce } from './debounce';
export { getIdString } from './ids';
export { setFocusTrap } from './focusTrap';
export {
  setTargetWatcher,
  setTourUpdateListener,
  setNextOnTargetClick,
  takeActionIfValid,
  type SetTourUpdateListenerArgs,
} from './listeners';
export {
  shouldScroll,
  targetChanged,
  tooltipDesync,
  shouldUpdate,
  type ShouldScrollArgs,
  type TargetChangedArgs,
  type TooltipDesyncArgs,
  type ShouldUpdateArgs,
} from './shouldUpdate';
