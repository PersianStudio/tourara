# Placement & orientations

Tourara scores candidate positions around the target and picks one that keeps **both** the target and the tooltip usable in the viewport.

## Cardinal orientations

```ts
import { CardinalOrientation } from '@persianstudio/tourara';

CardinalOrientation.NORTH       // above, centered
CardinalOrientation.SOUTH       // below, centered
CardinalOrientation.EAST        // right, centered
CardinalOrientation.WEST        // left, centered
CardinalOrientation.NORTHEAST   // diagonal / aligned variants
CardinalOrientation.NORTHWEST
CardinalOrientation.SOUTHEAST
CardinalOrientation.SOUTHWEST
CardinalOrientation.EASTNORTH
CardinalOrientation.EASTSOUTH
CardinalOrientation.WESTNORTH
CardinalOrientation.WESTSOUTH
CardinalOrientation.CENTER      // over the target (last resort)
```

## Biasing placement

```ts
orientationPreferences: [
  CardinalOrientation.SOUTH,
  CardinalOrientation.SOUTHEAST,
  CardinalOrientation.NORTH,
]
```

Preferences narrow the candidate pool. If none fit (tiny phone, huge target), the engine falls back to other candidates or **center**, then **clamps** into the visible viewport — it will not hard-pin a single preference off-screen.

## Gaps & motion

| Option | Default | Role |
|--------|---------|------|
| `tooltipSeparation` | `10` | Gap between focus border and tooltip; also caret length |
| `maskPadding` | `5` | Inflates the spotlight hole (and caret aim rect) |
| `transition` | `top 160ms ease, left 160ms ease` | Shell CSS transition |
| `disableAutoScroll` | `false` | Skip `scrollIntoView` when the step activates |
| `disableSmoothScroll` | `false` | Use instant scroll |

## Viewport clamping

Tooltip coordinates are **viewport-space** (`position: fixed` portal). After placement:

1. Prefer in-view candidates
2. Clamp with padding using `visualViewport` when available (mobile URL bar / keyboard)
3. Cap shell width/height with CSS (`min()`, `dvh`, safe-area)

## Caret vs placement

The caret (`corner: 'small'`) sits on the facing edge or corner of the tooltip and aims toward the padded focus border. It does **not** stretch across large gutters — length matches `tooltipSeparation` so it stays attached while the shell animates. Details: [Tooltip & caret](./tooltip-caret).

## RTL

With `direction: 'rtl'`, east/west preferences are mirrored via `resolveOrientationPreferences`. See [RTL & LTR](./rtl).
