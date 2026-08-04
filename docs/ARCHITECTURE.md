# Architecture

This document explains how **tourara** is organized so new contributors can navigate and extend it safely.

## Package layout

```text
tourara/
├── src/                 # Publishable library (@persianstudio/tourara)
├── showcase/            # GitHub Pages demo app (may use MUI for the demo shell only)
├── docs/                # Contributor & deep-dive docs (this folder)
├── README.md            # English user docs (default)
├── README.fa.md         # Persian user docs
└── .github/workflows/   # Pages deploy
```

## Library (`src/`) mental model

```text
App / Showcase
    │
    ├─ TourProvider  (React Context — no Zustand)
    │       │
    ├─ TourHost  ──reads──► context { tourProps, setTourProps }
    │                          ▲
    │                          │ useTour / setTourProps
    │                          │
    └─ Tour (controlled or via host)
            │
            ├─ Mask          SVG spotlight (HTML/CSS theme via data-theme)
            ├─ Tooltip/*     Default chrome (plain HTML + CSS variables)
            ├─ Tip/*         Inactive step markers
            └─ hooks         positioning, settle, scroll lock
```

| Area | Responsibility |
|------|----------------|
| `context/` | `TourProvider` + `useTourContext` (Zustand replacement) |
| `components/Tour/` | Orchestrates open state, step index, portal, keyboard, scroll lock |
| `components/Tooltip/` | Default tooltip UI (header / body / footer / stepper) |
| `components/Tip/` | Tip markers on non-active visible targets |
| `components/Mask/` | SVG cutout overlay |
| `components/TourHost/` | Context-bound wrapper around `Tour` |
| `hooks/useUpdateTour/` | Placement loop, listeners, ultra-fast settle |
| `styles/` | Default chrome CSS + one-time inject |
| `utils/positioning/` | Orientation candidates + best placement |
| `utils/tour/` | Debounce, focus trap, listeners, `shouldUpdate` |
| `types/` | Public TypeScript contracts |
| `constants/` | Defaults and DOM id prefixes |

## Public API stability

Consumers should import only from `@persianstudio/tourara` (see `src/index.ts`).

Internal folder moves are allowed as long as **`src/index.ts` exports stay compatible**.

## Dependencies

Library peers: **react** + **react-dom** only. Showcase may use MUI for the demo page chrome; that must not leak into `src/`.

## Tip markers

Inactive tip markers are placed by `TipLayer` in one pass. Placement avoids:

1. The active spotlight hole (target + `maskPadding`)
2. The open tooltip chrome
3. Other tip markers
4. Neighboring tip targets (so markers don’t sit on another hotspot)

If no clear slot exists, that tip is **hidden** rather than drawn over the tour.

**Perf:** no polling interval; scroll/resize coalesced to one rAF; at most 6 tips; `disableTips` skips the layer entirely.

## Performance model

| Path | Behavior |
|------|----------|
| Step open | Geometry + bind listeners **once**, then ≤~480ms geometry-only settle |
| Resize | Debounced geometry update (listeners stay bound) |
| Tips | Event-driven rAF recompute, capped |
| Visibility | Tour no longer runs a document MutationObserver; tip on-screen is local to TipLayer |

## Coordinate space

The tour portal is `position: fixed`. Mask, tooltip, and tip positions use **viewport coordinates** (`getBoundingClientRect`), not document-scroll offsets.

## Scroll while touring

User wheel/touch/page-keys are locked (`lockUserScroll`). Programmatic `scrollIntoView` used by the engine still runs so the tour can move the viewport.

## Showcase

`showcase/` is a Vite app that aliases `@persianstudio/tourara` → `../src`. Prefer adding demos under `showcase/sections/` or `showcase/demo/` without bloating `App.tsx`.

## Further reading

- [CONTRIBUTING.md](./CONTRIBUTING.md) — local setup and PR habits  
- [API.md](./API.md) — export map and option groups  
- [../README.md](../README.md) — end-user guide  
