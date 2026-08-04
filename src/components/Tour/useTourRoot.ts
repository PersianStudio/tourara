import * as React from 'react';
import { getNearestScrollAncestor as utilGetNearestScrollAncestor } from '../../utils/dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNearestScrollAncestor = utilGetNearestScrollAncestor as any;

export interface UseTourRootArgs {
  tourOpen: boolean;
  rootSelector?: string;
  /** Portal host element ref — used to find the nearest scroll ancestor. */
  portalRef: React.MutableRefObject<HTMLElement | undefined>;
}

/**
 * Resolves the scroll/clipping root for mask + tip positioning.
 * Prefers `rootSelector`, then the portal's nearest scroll ancestor, then `document.body`.
 */
export function useTourRoot({
  tourOpen,
  rootSelector,
  portalRef,
}: UseTourRootArgs): Element | undefined {
  const [tourRoot, setTourRoot] = React.useState<Element | undefined>(undefined);

  React.useEffect(() => {
    if (!tourOpen) {
      setTourRoot(undefined);
      return;
    }

    let root = rootSelector ? document.querySelector(rootSelector) : undefined;

    if (!root) {
      root = getNearestScrollAncestor(portalRef.current) || document.body;
    }

    if (root && root !== tourRoot) {
      setTourRoot(root as Element);
    }
  }, [rootSelector, tourOpen]);

  // Ensure tourRoot resolves on the first open frame even before portal ref exists.
  React.useLayoutEffect(() => {
    if (!tourOpen || tourRoot) return;
    const root =
      (rootSelector ? document.querySelector(rootSelector) : null) ||
      getNearestScrollAncestor(portalRef.current) ||
      document.body;
    setTourRoot(root as Element);
  }, [tourOpen, tourRoot, rootSelector]);

  return tourRoot;
}
