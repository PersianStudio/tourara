# tourara

**React product-tour toolkit** — SVG spotlight masks, smart tooltip placement, inactive tip markers, keyboard navigation, and a Zustand-backed host for multi-page apps.

**Languages:** English (default) · [فارسی (README.fa.md)](./README.fa.md)

| | |
|---|---|
| **Package** | [`@persianstudio/tourara`](https://www.npmjs.com/package/@persianstudio/tourara) *(npm publish coming soon)* |
| **Demo** | [persianstudio.github.io/tourara](https://persianstudio.github.io/tourara/) |
| **Repo** | [github.com/PersianStudio/tourara](https://github.com/PersianStudio/tourara) |
| **License** | MIT |

---

## Why we built tourara

We were looking for a **fully customizable open-source touring system** — one that let us own the UI, the step actions, and the animations without fighting the library.

After searching the ecosystem, we could not find a tour component that satisfied all of those needs with complete control over chrome and behavior. So we built the engine ourselves, used it in our own products, and are publishing it so other developers can ship onboarding the same way.

**tourara exists to give you:**

1. **Custom UI** — tooltip, footer, and mask slots so the tour matches your product, not a fixed skin  
2. **Custom actions** — interactive next/prev, click-to-advance, and DOM helpers for real app flows  
3. **Custom motion** — placement, auto-scroll, and transitions you can tune instead of a black box  

---

## Features

- **Spotlight mask** — full-viewport SVG overlay with a rounded cutout around the target
- **Smart placement** — 13 cardinal / diagonal orientations; prefers in-view candidates
- **RTL & LTR** — `direction: 'ltr' | 'rtl'` (default **`ltr`**); east/west preferences mirror in RTL; chrome uses `dir`
- **Tip markers** — small indicators on other visible steps (capped, rAF-throttled; opt out with `disableTips`)
- **Store or controlled** — mount `<TourHost />` + `useTour`, or drive `<Tour />` yourself
- **Interactive steps** — `customNextFunc`, `nextOnTargetClick`, DOM helpers for open-dropdown / wait-for-element flows
- **Keyboard** — `Escape` closes; `←` / `→` navigate (swapped in RTL reading order)
- **MUI-friendly** — default UI uses `@mui/material`; theme via your existing `ThemeProvider`
- **No router lock-in** — optional `resetKey` instead of a hard `react-router` dependency

Default **copy is English**. Pass your own `finishBtnText` / `skipBtnText` / labels for other locales (see Persian demo on the showcase).

---

## Requirements

| Peer | Versions |
|------|----------|
| `react` / `react-dom` | `^18` or `^19` |
| `@mui/material` | `^5` or `^6` |
| `@emotion/react` / `@emotion/styled` | `^11` |

Runtime dependency: `zustand` (bundled with the package).

---

## Install

```bash
pnpm add @persianstudio/tourara @mui/material @emotion/react @emotion/styled
# or: npm / yarn
```

Until the package is on npm:

```bash
pnpm add github:PersianStudio/tourara
# or link a local clone
pnpm link --global   # inside tourara after pnpm build
```

Wrap your app in MUI’s `ThemeProvider` (and usually `CssBaseline`) so mask colors and tooltip styles pick up `palette.mode` / `primary`.

---

## Quick start

### 1. Mark targets in the DOM

```tsx
<nav data-tour="nav">…</nav>
<button data-tour="cta">Save</button>
```

Any CSS selector works (`#id`, `.class`, `[data-tour="…"]`, etc.).

### 2. Store-backed host (recommended for apps)

Mount **one** host near the root. Pages register steps; a button (or effect) opens the tour.

```tsx
import {
  TourHost,
  useTour,
  useTourStore,
  type TourStep,
} from '@persianstudio/tourara';

const steps: TourStep[] = [
  {
    selector: '[data-tour="nav"]',
    title: 'Navigation',
    content: 'This is your primary nav.',
  },
  {
    selector: '[data-tour="cta"]',
    title: 'Call to action',
    content: 'Click Next when you are ready.',
  },
];

function PageTour() {
  // Registers steps into the store (does not open by itself unless isOpen: true)
  useTour({
    tourOptions: { steps },
    openImmediately: true,
  });

  const { setTourProps } = useTourStore();

  return (
    <button type="button" onClick={() => setTourProps({ isOpen: true })}>
      Start tour
    </button>
  );
}

export function App() {
  return (
    <>
      {/* Clear steps when the route changes */}
      <TourHost resetKey={window.location.pathname} />
      <PageTour />
      <nav data-tour="nav">Home</nav>
      <button data-tour="cta">Save</button>
    </>
  );
}
```

### 3. Controlled `<Tour />`

Use this when you own open state (modals, feature flags, tests).

```tsx
import { useState } from 'react';
import { Tour, type TourStep } from '@persianstudio/tourara';

const steps: TourStep[] = [
  {
    selector: '[data-tour="hero"]',
    title: 'Welcome',
    content: 'A short walkthrough of this screen.',
  },
];

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Start
      </button>
      <div data-tour="hero">Hero</div>
      <Tour
        steps={steps}
        isOpen={open}
        onClose={() => setOpen(false)}
        maskPadding={8}
        maskRadius={8}
      />
    </>
  );
}
```

---

## RTL & LTR

Default is **`direction: 'ltr'`** with **English** chrome labels.

```tsx
<Tour
  direction="rtl"
  steps={steps}
  isOpen={open}
  onClose={() => setOpen(false)}
  finishBtnText="پایان"
  skipBtnText="رد کردن"
  prevLabel="قبلی"
  nextLabel="بعدی"
/>
```

What changes in RTL:

| Concern | Behavior |
|---------|----------|
| Chrome | Tooltip / portal set `dir="rtl"` and right-aligned text |
| Placement | East/west `orientationPreferences` and tip defaults are mirrored |
| Chevrons | Prev/next icons flip to match reading order |
| Keyboard | `←` advances, `→` goes back (reading order) |

Pass Persian (or any) strings via label props — the library does **not** auto-translate. See also [README.fa.md](./README.fa.md) and the showcase **RTL / LTR** section.

---

## How it works

```text
┌─────────────────┐     setTourProps / useTour      ┌──────────────┐
│  Feature page   │ ──────────────────────────────► │  tour store  │
└─────────────────┘                                 └──────┬───────┘
                                                           │
                                                           ▼
┌─────────────────┐     portal + mask + tooltip     ┌──────────────┐
│  DOM targets    │ ◄────────────────────────────── │  TourHost /  │
│  [data-tour]    │                                 │  Tour        │
└─────────────────┘                                 └──────────────┘
```

1. Resolve the step’s `selector` in the document (or tour root).
2. Scroll the target into view (unless disabled / foreign target).
3. Draw the SVG mask cutout and place the tooltip using orientation preferences.
4. Show tip markers for other steps whose targets are visible.
5. Advance with footer buttons, keyboard, or `nextOnTargetClick`.

Missing selectors are **skipped** when navigating next/prev so tours stay robust when UI is conditional.

---

## API reference

### Components

| Export | Description |
|--------|-------------|
| `Tour` | Controlled overlay. Pass `steps`, `isOpen`, and usually `onClose`. |
| `TourHost` | Reads `useTourStore` and renders `Tour`. Mount once. Optional `resetKey` clears steps and closes when it changes. |
| `Mask` | Default SVG spotlight (also overridable via `renderMask`). |
| `Tooltip` | Default step chrome (title, content, stepper, footer). |
| `Tip` | Inactive-step marker near other visible targets. |

### Hooks & store

| Export | Description |
|--------|-------------|
| `useTour({ tourOptions, delay?, openImmediately? })` | Writes `tourOptions` into the store on mount (after `delay` ms, default `100`). Returns `{ tourProps, setTourProps }`. |
| `useTourStore` | Zustand store: `{ tourProps, setTourProps }`. |
| `createTourStore(initial?)` | Factory for an isolated store instance (advanced). |
| `useUpdateTour` / `useDetectVisibility` | Internal positioning / visibility hooks (exported for advanced forks). |

### Helpers

| Export | Description |
|--------|-------------|
| `isElementPresent(selector)` | `document.querySelector` boolean check. |
| `clickOnElement(selector)` | Programmatic click if the node exists. |
| `waitForElement(selector, durationMs)` | Poll until present or timeout. |
| `conditionalTourAction(target, fallbackClick, onSuccess, onFailure?, …)` | If target missing → click fallback → wait → run success/failure. Ideal for “open menu, then highlight item”. |
| `CardinalOrientation` | Placement enum (see below). |
| `tourDefaultProps` | Default `TourProps` merge base. |

### Types

`TourStep`, `TourProps`, `TourOptions`, `TourLogic`, `TourHostProps`, `MaskOptions`, `UseTourOptions`, `TourState`, `Coords`, `Dims`, `ElementInfo`.

---

## Options

Options can be set on the **tour** (`Tour` / store props) and **overridden per step**.

### Content & chrome

| Option | Type | Notes |
|--------|------|--------|
| `selector` | `string` | **Required** on each step. |
| `title` | `ReactNode` \| `(logic) => ReactNode` | Optional header. |
| `content` | `ReactNode` \| `(logic) => ReactNode` | Step body. |
| `finishBtnText` | `string` | Last-step primary button (default `"Done"`). |
| `skipBtnText` | `string` | Skip label (default `"Skip"`). |
| `noFooter` / `noCloseIcon` / `noSkipBtn` / `noStepper` | `boolean` | Hide parts of the default tooltip. |
| `corner` | `'none' \| 'small'` | Decorative corner SVG on diagonal placements. |
| `audio` / `video` / `image` | `boolean` | Show media affordance buttons in the default tooltip. |
| `videoBtnText` / `imageBtnText` | `string` | Labels for those buttons. |

### Mask & layout

| Option | Default | Notes |
|--------|---------|--------|
| `maskPadding` | `5` | Gap around the cutout. |
| `maskRadius` | `2` | Cutout corner radius. |
| `disableMask` | `false` | Hide the overlay. |
| `disableTips` | `false` | Skip inactive tip markers (cheapest tip mode). |
| `disableMaskInteraction` | `false` | When `true`, mask captures pointer events more aggressively. |
| `disableCloseOnClick` | `false` | Don’t close when clicking the dimmed area. |
| `tooltipMaxWidth` | responsive | Number, string, or MUI breakpoint map. |
| `tooltipSeparation` | `0` | Extra distance from the target. |
| `tooltipBorderRadius` | — | Tooltip radius (MUI spacing units in default UI). |
| `tooltipContainerSx` / `contentContainerSx` | — | MUI `sx` overrides. |
| `transition` | `top/left 300ms ease` | Tooltip move transition. |
| `zIndex` | `10000` | Portal stacking. |
| `rootSelector` | — | Scroll / portal root; otherwise nearest scroll ancestor. |
| `allowForeignTarget` | `true` | Allow targets outside the tour root. |
| `disableAutoScroll` / `disableSmoothScroll` | `false` | Scroll behavior. |
| `movingTarget` | — | Poll for targets that move/resize. |
| `updateInterval` / `renderTolerance` | `500` / `2` | Update cadence / drift tolerance. |

### Placement

```ts
import { CardinalOrientation } from '@persianstudio/tourara';

orientationPreferences: [
  CardinalOrientation.SOUTH,
  CardinalOrientation.NORTH,
  CardinalOrientation.EAST,
],
tipOrientationPreferences: [CardinalOrientation.EAST],
```

Values: `east`, `south`, `west`, `north`, `center`, `east-north`, `east-south`, `south-east`, `south-west`, `west-south`, `west-north`, `north-west`, `north-east`.

Custom scoring: `getPositionFromCandidates(candidates) => OrientationCoords`.

### Behavior & slots

| Option | Notes |
|--------|--------|
| `isOpen` | Whether the overlay is shown. |
| `initialStepIndex` | Starting step. |
| `resetKey` | On `Tour` / `TourHost`: change resets to step `0` (host also clears store steps). |
| `onClose` | Controlled close; prefer over the store when using `<Tour />`. |
| `disableNext` / `disablePrev` / `disableClose` | Block actions / keys. |
| `nextOnTargetClick` | Advance when the highlighted element is clicked. |
| `validateNextOnTargetClick` | `() => Promise<boolean>` gate for that click. |
| `customNextFunc` / `customPrevFunc` / `customCloseFunc` | Async hooks receiving `TourLogic`. |
| `customTooltipRenderer` | Replace the entire tooltip. |
| `customFooterRenderer` / `customTitleRenderer` / `customContentRenderer` | Partial UI slots. |
| `renderMask` | Replace the SVG mask. |

### `TourLogic` (passed to custom renderers / custom funcs)

```ts
interface TourLogic {
  next: (fromTarget?: boolean) => void;
  skip: (fromTarget?: boolean) => void;
  prev: () => void;
  close: (reset?: boolean) => void;
  goToStep: (stepNumber: number) => void;
  stepContent: TourStep;
  stepIndex: number;
  allSteps: TourStep[];
  tooltipPosition: OrientationCoords | undefined;
}
```

---

## Interactive step example

Open a menu before highlighting an item inside it:

```tsx
import {
  conditionalTourAction,
  type TourLogic,
  type TourStep,
} from '@persianstudio/tourara';

const steps: TourStep[] = [
  {
    selector: '[data-tour="menu-item"]',
    title: 'Reports',
    content: 'Open reports from this menu item.',
    customNextFunc: async (logic: TourLogic) => {
      await conditionalTourAction(
        '[data-tour="menu-item"]',
        '[data-tour="menu-trigger"]',
        () => logic.next(),
      );
    },
  },
];
```

---

## Keyboard & a11y notes

| Key | Action |
|-----|--------|
| `Escape` | Close (unless `disableClose`) |
| `ArrowRight` | Next (unless `disableNext`) |
| `ArrowLeft` | Prev (unless `disablePrev`) |

While open, `document.body` scroll is locked. Focus returns to the last target on close when possible. Prefer meaningful `title` text and visible targets for screen-reader users; custom tooltips can add your own ARIA as needed.

---

## Theming

Tourara reads the ambient MUI theme:

- Mask stroke/fill follow `palette.mode` (light vs dark)
- Tip markers use `palette.primary`
- Default tooltip uses neutral `grey.*` surfaces

Override appearance with `tooltipContainerSx`, `contentContainerSx`, or `customTooltipRenderer` / `renderMask` without forking the package.

---

## Project structure

```text
tourara/
├── src/                     # Publishable library
│   ├── components/          # Tour, TourHost, Mask, Tooltip, Tip
│   ├── hooks/               # useTour, useUpdateTour, useDetectVisible
│   ├── store/               # Zustand tour store
│   ├── types/               # TourStep, TourProps, …
│   ├── utils/               # positioning, DOM, tourActions
│   ├── assets/              # TourTooltipCorner SVG
│   └── index.ts             # Public exports
├── showcase/                # GitHub Pages demo app
├── .github/workflows/       # Pages deploy
├── vite.config.ts           # Library build (ES + CJS + d.ts)
└── vite.showcase.config.ts  # Demo build (base: /tourara/)
```

---

## Local development

```bash
pnpm install
pnpm dev              # Showcase → http://localhost:5173/tourara/
pnpm build            # Library → dist/
pnpm build:showcase   # Static demo → showcase-dist/
pnpm preview          # Preview showcase-dist
pnpm typecheck
```

---

## GitHub Pages

Every push to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml): install → build library → build showcase → deploy.

Enable once: repo **Settings → Pages → Source → GitHub Actions**.  
Live demo: https://persianstudio.github.io/tourara/

---

## Publishing (later)

The package is npm-ready (`exports`, `files: ["dist"]`, `publishConfig.access: public`). When ready:

```bash
pnpm build
pnpm publish --access public
```

---

## Extending

- Prefer **slots** (`customTooltipRenderer`, `renderMask`, custom next/prev/close) over editing core files.
- Keep positioning / DOM math in `src/utils`; keep UI in `src/components`.
- New themes can ship as separate entry points later without changing the engine.

---

## Project docs

Contributor-oriented docs live under [`docs/`](./docs/):

| Doc | Purpose |
|-----|---------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Folder layout & runtime mental model |
| [docs/API.md](./docs/API.md) | Export map & option groups |
| [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Setup, principles, PR checklist |

---

## Credits

Extracted and open-sourced from the ICE web app tour system by [Persian Studio](https://github.com/PersianStudio).

## License

[MIT](./LICENSE) © Persian Studio
