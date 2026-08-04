# Responsive & mobile

Tourara is built to stay usable from large desktops down to phones and short landscape viewports.

## What the library does

| Area | Behavior |
|------|----------|
| Shell width | `min(400px, 100vw − padding − safe-area)` |
| Shell height | Capped with `dvh` + safe-area; body scrolls |
| Placement | Fit-aware candidates; always clamp into visual viewport |
| Scroll | `scrollIntoView` (`center` or `nearest` on short screens); geometry tracks scroll frames |
| Caret | Short, card-local; uses destination coords during CSS transitions |
| Touch | Wheel/touch lock skips the tooltip body so content can scroll |
| Listeners | `resize`, `scroll`, `scrollend`, `orientationchange`, `visualViewport` |

## Options that help on mobile

```ts
{
  orientationPreferences: [
    CardinalOrientation.SOUTH,
    CardinalOrientation.NORTH,
  ], // prefer vertical on narrow layouts
  tooltipSeparation: 8,
  maskPadding: 6,
  disableTips: true, // optional — fewer overlays on tiny screens
}
```

Avoid pinning only `EAST` / `WEST` when your UI stacks into a single column on phones.

## Custom chrome checklist

- `maxWidth: 'min(360px, calc(100vw - 32px))'`
- Footer `flex-wrap: wrap`
- Tap targets ≥ 40×40
- Don’t rely on `100vw` alone for overlays (scrollbar / mobile chrome) — the library portal uses `inset: 0` + `dvh`

## Reduced motion

When `prefers-reduced-motion: reduce`, shell transitions are disabled in default CSS.
