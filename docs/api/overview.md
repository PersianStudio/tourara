# API overview

All public exports come from `@persianstudio/tourara`.

```ts
import {
  // Components
  Tour,
  TourProvider,
  TourHost,
  Mask,
  Tooltip,
  Tip,
  // Hooks / context
  useTour,
  useTourContext,
  useTourStore,
  useUpdateTour,
  useDetectVisibility,
  // Constants / enums
  tourDefaultProps,
  CardinalOrientation,
  // Direction helpers
  mirrorOrientation,
  resolveOrientationPreferences,
  defaultTipOrientations,
  // DOM helpers
  waitForElement,
  isElementPresent,
  clickOnElement,
  conditionalTourAction,
} from '@persianstudio/tourara';

import type {
  TourProps,
  TourStep,
  TourOptions,
  TourLogic,
  TourDirection,
  TourState,
  TourContextValue,
  TourProviderProps,
  TourHostProps,
  MaskOptions,
  UseTourOptions,
  Coords,
  Dims,
  ElementInfo,
} from '@persianstudio/tourara';

// Optional static CSS
import '@persianstudio/tourara/styles.css';
```

## Where to go next

| Page | Contents |
|------|----------|
| [Components & hooks](./components) | `Tour`, host, context, mask, tooltip, tips |
| [Options & steps](./options) | Full `TourOptions` / `TourStep` / `TourProps` tables |
| [DOM helpers](./helpers) | Wait / click / conditional actions |

Internal modules under `src/` may move; **`src/index.ts` is the stability contract**.
