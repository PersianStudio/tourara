# Architecture

How tourara is layered so contributors can navigate and extend it safely.

## Package layout

```text
tourara/
├── src/                 # Publishable library
├── showcase/            # Live demo (GitHub Pages root)
├── docs/                # This VitePress site (Pages at /tourara/docs/)
├── README.md            # npm / GitHub overview
├── README.fa.md         # Persian overview
└── .github/workflows/   # Pages deploy
```

## Runtime mental model

```text
App / Showcase
    │
    ├─ TourProvider  (React Context)
    │       │
    ├─ TourHost  ──reads──► context { tourProps, setTourProps }
    │                          ▲
    │                          │ useTour / setTourProps
    │                          │
    └─ Tour
            │
            ├─ Mask          SVG spotlight
            ├─ Tooltip/*     Default chrome + geometry caret
            ├─ Tip/*         Inactive step markers
            └─ hooks         placement, settle, scroll lock, visualViewport
```

| Area | Responsibility |
|------|----------------|
| `context/` | `TourProvider` + `useTourContext` |
| `components/Tour/` | Open state, steps, portal, keyboard, scroll lock |
| `components/Tooltip/` | Default tooltip + caret |
| `components/Tip/` | Tip markers |
| `components/Mask/` | SVG cutout |
| `hooks/useUpdateTour/` | Geometry loop, listeners, settle |
| `styles/` | Default CSS + inject |
| `utils/positioning/` | Candidates + best placement + viewport clamp |
| `types/` | Public contracts |

## Coordinate space

Portal is `position: fixed`. Mask, tooltip, and tips use **viewport coordinates** (`getBoundingClientRect` / `visualViewport`), never document scroll offsets for shell `top`/`left`.

## Performance model

| Path | Behavior |
|------|----------|
| Step open | Geometry + bind listeners once, then settle |
| Resize | Debounced geometry (listeners stay bound) |
| Scroll | rAF-coalesced geometry so smooth `scrollIntoView` stays synced |
| Tips | Event-driven rAF, capped count |

## Public API stability

Consumers import only from `@persianstudio/tourara` (`src/index.ts`). Internal folders may move if exports stay compatible.

## Dependencies

Library peers: **react** + **react-dom** only. Showcase may use MUI; it must not leak into `src/`.
