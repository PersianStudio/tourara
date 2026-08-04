/** Fixed size, gaps, and clearances for inactive tip markers. */
export const TIP_SIZE = 26;
/** Gap between tip marker and its own target edge. */
export const TIP_GAP = 10;
/** Minimum gap between a tip and hard obstacles (tooltip, spotlight, other tips). */
export const TIP_CLEARANCE = 10;
/** Soft padding around sibling tip targets so markers don't sit on neighboring hotspots. */
export const SIBLING_TARGET_PAD = 4;
/** Keep tips slightly inside the viewport. */
export const VIEWPORT_INSET = 4;
/**
 * Extra inflate around the tooltip shell so tips stay clear of the card + caret.
 * Must cover caret overhang so markers never kiss the chrome.
 */
export const TOOLTIP_OBSTACLE_PAD = 36;
