# Architecture

This document explains how **tourara** is organized so new contributors can navigate and extend it safely.

## Package layout

```text
tourara/
├── src/                 # Publishable library (@persianstudio/tourara)
├── showcase/            # GitHub Pages demo app
├── docs/                # Contributor & deep-dive docs (this folder)
├── README.md            # English user docs (default)
├── README.fa.md         # Persian user docs
└── .github/workflows/   # Pages deploy
```

## Library (`src/`) mental model

```text
App / Showcase
    │
    ├─ TourHost  ──reads──► tourStore (zustand)
    │                          ▲
    │                          │ useTour / setTourProps
    │                          │
    └─ Tour (controlled or via host)
            │
            ├─ Mask          SVG spotlight
            ├─ Tooltip/*     Default chrome (RTL-aware)
            ├─ Tip/*         Inactive step markers
            └─ hooks         positioning, visibility, scroll lock
```

| Area | Responsibility |
|------|----------------|
| `components/Tour/` | Orchestrates open state, step index, portal, keyboard, scroll lock |
| `components/Tooltip/` | Default tooltip UI (header / body / footer / stepper) |
| `components/Tip/` | Tip markers on non-active visible targets |
| `components/Mask/` | SVG cutout overlay |
| `components/TourHost/` | Store-bound wrapper around `Tour` |
| `hooks/useUpdateTour/` | Placement loop, listeners, ultra-fast settle |
| `hooks/` | `useTour`, visibility detection |
| `store/` | Global tour props for `TourHost` |
| `utils/positioning/` | Orientation candidates + best placement |
| `utils/tour/` | Debounce, focus trap, listeners, `shouldUpdate` |
| `utils/` | DOM geometry, direction, scroll lock, tour actions |
| `types/` | Public TypeScript contracts |
| `constants/` | Defaults and DOM id prefixes |

## Public API stability

Consumers should import only from `@persianstudio/tourara` (see `src/index.ts`).

Internal folder moves are allowed as long as **`src/index.ts` exports stay compatible**.

## Direction (LTR / RTL)

- Default: `direction: 'ltr'` and English chrome labels.
- RTL mirrors east/west placement preferences and flips chevrons / arrow-key order.
- Locale strings are **not** auto-translated; pass `finishBtnText`, `skipBtnText`, etc.

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
