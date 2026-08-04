/**
 * Collision-aware tip placement (budget-conscious candidate search).
 *
 * Tries preferred sides first at the default gap, then a short fallback set.
 * Edge-slides and a second gap only run if the cheap pass fails.
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
  obstacles?: TipRect[];
  clearance?: number;
  /** Skip an extra getBoundingClientRect when the caller already measured. */
  targetRect?: Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>;
};

const CHEAP_FALLBACKS: CardinalOrientation[] = [
  CardinalOrientation.EAST,
  CardinalOrientation.WEST,
  CardinalOrientation.SOUTH,
  CardinalOrientation.NORTH,
];

const FULL_FALLBACKS: CardinalOrientation[] = [
  ...CHEAP_FALLBACKS,
  CardinalOrientation.SOUTHEAST,
  CardinalOrientation.NORTHEAST,
  CardinalOrientation.SOUTHWEST,
  CardinalOrientation.NORTHWEST,
];

function candidateFor(
  rect: Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>,
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

function edgeSlideCandidates(
  rect: Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>,
  gap: number,
): Array<{ orientation: CardinalOrientation; x: number; y: number }> {
  // One slide per side (was eight) — enough to escape mid-edge blocks.
  const t = 0.2;
  const y = rect.top + rect.height * t - TIP_SIZE / 2;
  const x = rect.left + rect.width * t - TIP_SIZE / 2;
  return [
    { orientation: CardinalOrientation.EAST, x: rect.right + gap, y },
    { orientation: CardinalOrientation.WEST, x: rect.left - gap - TIP_SIZE, y },
    { orientation: CardinalOrientation.SOUTH, x, y: rect.bottom + gap },
    { orientation: CardinalOrientation.NORTH, x, y: rect.top - gap - TIP_SIZE },
  ];
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
  if (obstacles.length === 0) return true;
  const box = tipMarkerRect(x, y, TIP_SIZE);
  for (let i = 0; i < obstacles.length; i++) {
    if (rectsOverlap(box, obstacles[i], clearance)) return false;
  }
  return true;
}

function tryOrientations(
  rect: Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>,
  orientations: CardinalOrientation[],
  gap: number,
  obstacles: TipRect[],
  clearance: number,
): PlaceTipMarkerResult | null {
  for (const o of orientations) {
    const c = candidateFor(rect, o, gap);
    if (isClear(c.x, c.y, obstacles, clearance)) return c;
  }
  return null;
}

export function placeTipMarker(
  target: HTMLElement,
  options: PlaceTipMarkerOptions | CardinalOrientation[],
): PlaceTipMarkerResult | null {
  const opts: PlaceTipMarkerOptions = Array.isArray(options)
    ? { preferences: options }
    : options;

  const preferences = opts.preferences?.length
    ? opts.preferences
    : CHEAP_FALLBACKS;
  const obstacles = opts.obstacles ?? [];
  const clearance = opts.clearance ?? TIP_CLEARANCE;

  const rect = opts.targetRect ?? target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const preferred = dedupeOrientations(preferences);

  // Pass 1: preferences + cardinals at default gap (most tips resolve here).
  const cheap = tryOrientations(
    rect,
    dedupeOrientations([...preferred, ...CHEAP_FALLBACKS]),
    TIP_GAP,
    obstacles,
    clearance,
  );
  if (cheap) return cheap;

  // Pass 2: corners + edge slides, still default gap.
  const wider = tryOrientations(
    rect,
    dedupeOrientations([...preferred, ...FULL_FALLBACKS]),
    TIP_GAP,
    obstacles,
    clearance,
  );
  if (wider) return wider;

  for (const c of edgeSlideCandidates(rect, TIP_GAP)) {
    if (isClear(c.x, c.y, obstacles, clearance)) return c;
  }

  // Pass 3: one larger gap only if still blocked (crowded UI near tooltip).
  const pushed = tryOrientations(
    rect,
    dedupeOrientations([...preferred, ...FULL_FALLBACKS]),
    TIP_GAP + 12,
    obstacles,
    clearance,
  );
  return pushed;
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

export function spotlightObstacle(activeTarget: HTMLElement | undefined, maskPadding: number): TipRect | null {
  if (!activeTarget) return null;
  const r = activeTarget.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return inflateRect(toTipRect(r), Math.max(0, maskPadding));
}

export function tooltipObstacle(tooltipEl: HTMLElement | undefined | null, margin = 10): TipRect | null {
  if (!tooltipEl) return null;
  const r = tooltipEl.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return inflateRect(toTipRect(r), margin);
}
