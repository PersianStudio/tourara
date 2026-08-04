/**
 * Shared geometry helpers for tip-marker collision checks.
 * Tips use viewport (fixed) coordinates, matching getBoundingClientRect.
 */

export type TipRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/** Convert a DOMRect / ClientRect-like object into TipRect. */
export function toTipRect(r: { left: number; top: number; right: number; bottom: number }): TipRect {
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
}

/** Expand a rect outward by `pad` pixels on every side. */
export function inflateRect(rect: TipRect, pad: number): TipRect {
  if (pad <= 0) return rect;
  return {
    left: rect.left - pad,
    top: rect.top - pad,
    right: rect.right + pad,
    bottom: rect.bottom + pad,
  };
}

/** Axis-aligned overlap test with optional extra clearance between boxes. */
export function rectsOverlap(a: TipRect, b: TipRect, clearance = 0): boolean {
  return !(
    a.right + clearance <= b.left ||
    a.left >= b.right + clearance ||
    a.bottom + clearance <= b.top ||
    a.top >= b.bottom + clearance
  );
}

/** Bounding box for a tip marker at viewport top-left `(x, y)`. */
export function tipMarkerRect(x: number, y: number, size: number): TipRect {
  return { left: x, top: y, right: x + size, bottom: y + size };
}

/**
 * True when `inner` is mostly covered by `outer` (e.g. tip target sits inside
 * the active spotlight hole — no tip should render for it).
 */
export function isMostlyInside(inner: TipRect, outer: TipRect, coverage = 0.6): boolean {
  const ix = Math.max(0, Math.min(inner.right, outer.right) - Math.max(inner.left, outer.left));
  const iy = Math.max(0, Math.min(inner.bottom, outer.bottom) - Math.max(inner.top, outer.top));
  const overlapArea = ix * iy;
  const innerArea = Math.max(1, (inner.right - inner.left) * (inner.bottom - inner.top));
  return overlapArea / innerArea >= coverage;
}

/** Center-point distance between two rects (for placement priority). */
export function rectCenterDistance(a: TipRect, b: TipRect): number {
  const ax = (a.left + a.right) / 2;
  const ay = (a.top + a.bottom) / 2;
  const bx = (b.left + b.right) / 2;
  const by = (b.top + b.bottom) / 2;
  return Math.hypot(ax - bx, ay - by);
}
