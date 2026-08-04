# API map

User-facing guide: [README.md](../README.md). This page is a **contributor-oriented** map of exports and option groups.

## Entry

```ts
import {
  Tour,
  TourProvider,
  TourHost,
  useTour,
  useTourContext,
  useTourStore, // alias of useTourContext
  Mask,
  Tooltip,
  Tip,
  CardinalOrientation,
  tourDefaultProps,
  waitForElement,
  isElementPresent,
  clickOnElement,
  conditionalTourAction,
  mirrorOrientation,
  resolveOrientationPreferences,
  defaultTipOrientations,
} from '@persianstudio/tourara';

import type {
  TourProps,
  TourStep,
  TourOptions,
  TourLogic,
  TourDirection,
  TourState,
  MaskOptions,
  Coords,
  Dims,
  ElementInfo,
} from '@persianstudio/tourara';
```

## Components

| Export | Mode | Notes |
|--------|------|--------|
| `TourProvider` | Context | Required for host / `useTour` / `useTourContext` |
| `Tour` | Controlled | Pass `isOpen`, `steps`, prefer `onClose` (no provider needed) |
| `TourHost` | Context-bound | Mount once under provider; pages call `useTour` / `setTourProps` |
| `Tooltip` | Default chrome | Plain HTML/CSS; replace via `customTooltipRenderer` |
| `Tip` | Markers | Inactive steps; viewport-fixed |
| `Mask` | Overlay | Replace via `renderMask` |

## Hooks & context

| Export | Role |
|--------|------|
| `useTour` | Write steps/options into context on mount |
| `useTourContext` / `useTourStore` | `{ tourProps, setTourProps }` |
| `useUpdateTour` | Internal positioning loop (advanced) |
| `useDetectVisibility` | IntersectionObserver visibility (advanced) |

## Option groups (`TourOptions` / per-step)

| Group | Examples |
|-------|----------|
| Direction | `direction: 'ltr' \| 'rtl'` |
| Mask | `maskPadding`, `maskRadius`, `disableMask`, `renderMask` |
| Tips | `disableTips`, `tipOrientationPreferences` |
| Placement | `orientationPreferences`, `tooltipSeparation` |
| Chrome | `noFooter`, `noStepper`, `finishBtnText`, `skipBtnText`, `corner` |
| Style | `tooltipContainerStyle`, `contentContainerStyle`, CSS variables |
| Slots | `customTooltipRenderer`, `customFooterRenderer`, `customNextFunc` |
| Behavior | `nextOnTargetClick`, `movingTarget`, `updateInterval` (≥200ms), `disableAutoScroll`, `allowForeignTarget` |

## DOM helpers

| Export | Role |
|--------|------|
| `isElementPresent` | Boolean query |
| `clickOnElement` | Programmatic click |
| `waitForElement` | Poll until present |
| `conditionalTourAction` | Open menu / wait / then proceed |

## Defaults

See `tourDefaultProps` in `src/constants/`. Override per tour or per step; step wins over tour props when merged.
