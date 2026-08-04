/**
 * Collision-aware tip placement.
 *
 * Candidates must:
 * 1. Fit in the viewport
 * 2. Not overlap the active spotlight / tooltip / other tips / sibling targets
 *
 * Prefer caller-supplied orientations, then fall back through a full side set.
 * Returns `null` when every candidate collides — hiding the tip beats a bad overlap.
 */
import { CardinalOrientation } from '../../utils/positioning';
import { TIP_CLEARANCE, TIP_GAP, TIP_SIZE, VIEWPORT_INSET } from './constants';
import {
  inflateRect,
  rectsOverlap,
  tipMarkerRect,
  type TipRect,
  toTipRect,
} from './tipGeometry';

export type PlaceTipMarkerResult = {
  x: number;
  y: number;
  orientation: CardinalOrientation;
};

export type PlaceTipMarkerOptions = {
  preferences: CardinalOrientation[];
  /** Hard obstacles (spotlight, tooltip, already-placed tips). */
  obstacles?: TipRect[];
  /** Extra gap between tip and obstacles (defaults to TIP_CLEARANCE). */
  clearance?: number;
};

/** All sides we may try after preferred orientations fail. */
const FALLBACK_ORIENTATIONS: CardinalOrientation[] = [
  CardinalOrientation.EAST,
  CardinalOrientation.WEST,
  CardinalOrientation.SOUTH,
  CardinalOrientation.NORTH,
  CardinalOrientation.SOUTHEAST,
  CardinalOrientation.NORTHEAST,
  CardinalOrientation.SOUTHWEST,
  CardinalOrientation.NORTHWEST,
  CardinalOrientation.EASTSOUTH,
  CardinalOrientation.EASTNORTH,
  CardinalOrientation.WESTSOUTH,
  CardinalOrientation.WESTNORTH,
];

function candidateFor(
  rect: DOMRect,
  orientation: CardinalOrientation,
  gap: number,
): { orientation: CardinalOrientation; x: number; y: number } {
  const midY = rect.top + rect.height / 2 - TIP_SIZE / 2;
  const midX = rect.left + rect.width / 2 - TIP_SIZE / 2;

  switch (orientation) {
    case CardinalOrientation.EAST:
      return { orientation, x: rect.right + gap, y: midY };
    case CardinalOrientation.WEST:
      return { orientation, x: rect.left - gap - TIP_SIZE, y: midY };
    case CardinalOrientation.SOUTH:
      return { orientation, x: midX, y: rect.bottom + gap };
    case CardinalOrientation.NORTH:
      return { orientation, x: midX, y: rect.top - gap - TIP_SIZE };
    case CardinalOrientation.SOUTHEAST:
    case CardinalOrientation.EASTSOUTH:
      return { orientation, x: rect.right + gap, y: rect.bottom - TIP_SIZE };
    case CardinalOrientation.NORTHEAST:
    case CardinalOrientation.EASTNORTH:
      return { orientation, x: rect.right + gap, y: rect.top };
    case CardinalOrientation.SOUTHWEST:
    case CardinalOrientation.WESTSOUTH:
      return { orientation, x: rect.left - gap - TIP_SIZE, y: rect.bottom - TIP_SIZE };
    case CardinalOrientation.NORTHWEST:
    case CardinalOrientation.WESTNORTH:
      return { orientation, x: rect.left - gap - TIP_SIZE, y: rect.top };
    case CardinalOrientation.CENTER:
    default:
      return { orientation: CardinalOrientation.EAST, x: rect.right + gap, y: midY };
  }
}

/** Extra candidates offset along an edge when mid-side is blocked. */
function edgeSlideCandidates(
  rect: DOMRect,
  gap: number,
): Array<{ orientation: CardinalOrientation; x: number; y: number }> {
  const slides = [0.25, 0.75];
  const out: Array<{ orientation: CardinalOrientation; x: number; y: number }> = [];
  for (const t of slides) {
    const y = rect.top + rect.height * t - TIP_SIZE / 2;
    const x = rect.left + rect.width * t - TIP_SIZE / 2;
    out.push({ orientation: CardinalOrientation.EAST, x: rect.right + gap, y });
    out.push({ orientation: CardinalOrientation.WEST, x: rect.left - gap - TIP_SIZE, y });
    out.push({ orientation: CardinalOrientation.SOUTH, x, y: rect.bottom + gap });
    out.push({ orientation: CardinalOrientation.NORTH, x, y: rect.top - gap - TIP_SIZE });
  }
  return out;
}

function fitsViewport(x: number, y: number): boolean {
  return (
    x >= VIEWPORT_INSET &&
    y >= VIEWPORT_INSET &&
    x + TIP_SIZE <= window.innerWidth - VIEWPORT_INSET &&
    y + TIP_SIZE <= window.innerHeight - VIEWPORT_INSET
  );
}

function isClear(x: number, y: number, obstacles: TipRect[], clearance: number): boolean {
  if (!fitsViewport(x, y)) return false;
  const box = tipMarkerRect(x, y, TIP_SIZE);
  return !obstacles.some((o) => rectsOverlap(box, o, clearance));
}

/**
 * Place a tip beside `target`, avoiding `obstacles`.
 * Returns `null` when no clear viewport position exists.
 */
export function placeTipMarker(
  target: HTMLElement,
  options: PlaceTipMarkerOptions | CardinalOrientation[],
): PlaceTipMarkerResult | null {
  // Back-compat: older callers passed preferences as the 2nd argument array.
  const opts: PlaceTipMarkerOptions = Array.isArray(options)
    ? { preferences: options }
    : options;

  const preferences = opts.preferences?.length
    ? opts.preferences
    : [CardinalOrientation.EAST, CardinalOrientation.WEST, CardinalOrientation.SOUTH, CardinalOrientation.NORTH];
  const obstacles = opts.obstacles ?? [];
  const clearance = opts.clearance ?? TIP_CLEARANCE;

  const rect = target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const ordered = dedupeOrientations([...preferences, ...FALLBACK_ORIENTATIONS]);
  const gaps = [TIP_GAP, TIP_GAP + 6, TIP_GAP + 14];

  for (const gap of gaps) {
    const candidates = [
      ...ordered.map((o) => candidateFor(rect, o, gap)),
      ...edgeSlideCandidates(rect, gap),
    ];

    for (const c of candidates) {
      if (isClear(c.x, c.y, obstacles, clearance)) {
        return c;
      }
    }
  }

  // Nothing clear — hide rather than draw over the tooltip / spotlight / siblings.
  return null;
}

function dedupeOrientations(list: CardinalOrientation[]): CardinalOrientation[] {
  const seen = new Set<CardinalOrientation>();
  const out: CardinalOrientation[] = [];
  for (const o of list) {
    if (seen.has(o)) continue;
    seen.add(o);
    out.push(o);
  }
  return out;
}

/** Build a spotlight obstacle from the active target + mask padding. */
export function spotlightObstacle(activeTarget: HTMLElement | undefined, maskPadding: number): TipRect | null {
  if (!activeTarget) return null;
  const r = activeTarget.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return inflateRect(toTipRect(r), Math.max(0, maskPadding));
}

/** Build a tooltip obstacle from the tour tooltip container element. */
export function tooltipObstacle(tooltipEl: HTMLElement | undefined | null, margin = 10): TipRect | null {
  if (!tooltipEl) return null;
  const r = tooltipEl.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return inflateRect(toTipRect(r), margin);
}
