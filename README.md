<p align="center">
  <img src="./docs/public/logo.svg" alt="tourara" width="96" height="96" />
</p>

# tourara

[![npm](https://img.shields.io/npm/v/@persianstudio/tourara?color=3b82f6&label=npm)](https://www.npmjs.com/package/@persianstudio/tourara)
[![license](https://img.shields.io/badge/license-MIT-0b1220?labelColor=101826)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-GitHub%20Pages-1d4ed8)](https://persianstudio.github.io/tourara/showcase/)
[![docs](https://img.shields.io/badge/docs-read%20the%20docs-3b82f6)](https://persianstudio.github.io/tourara/docs/)
[![react](https://img.shields.io/badge/peers-React%2018%2F19-61dafb?labelColor=0b1220)](https://react.dev/)
[![bundle](https://img.shields.io/badge/deps-zero%20runtime-22c55e?labelColor=0b1220)](./package.json)

**React product-tour & onboarding toolkit** — SVG spotlight masks, smart tooltip placement, tip markers, keyboard navigation, RTL/LTR, and render slots. Context-backed host for multi-page apps. Peers: **React only** (no MUI, no Zustand).

> Looking for an **Intro.js / Shepherd / Reactour / Driver.js**-style walkthrough with full UI ownership? Tourara is built for that.

**Languages:** English (default) · [فارسی (README.fa.md)](./README.fa.md)

| | |
|---|---|
| **Package** | [`@persianstudio/tourara`](https://www.npmjs.com/package/@persianstudio/tourara) |
| **Live demo** | [persianstudio.github.io/tourara/showcase](https://persianstudio.github.io/tourara/showcase/) |
| **Docs** | [persianstudio.github.io/tourara/docs](https://persianstudio.github.io/tourara/docs/) |
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
- **Precise caret** — tooltip pointer aims at the focus border (`corner: 'small' | 'none'`)
- **RTL & LTR** — `direction: 'ltr' | 'rtl'` (default **`ltr`**); east/west preferences mirror in RTL; chrome uses `dir`
- **Tip markers** — small indicators on other visible steps (capped, rAF-throttled; opt out with `disableTips`)
- **Context or controlled** — wrap `<TourProvider>` + `<TourHost />` + `useTour`, or drive `<Tour />` yourself
- **Interactive steps** — `customNextFunc`, `nextOnTargetClick`, DOM helpers for open-dropdown / wait-for-element flows
- **Keyboard** — `Escape` closes; `←` / `→` navigate (swapped in RTL reading order)
- **Zero UI peers** — default chrome is plain HTML/CSS (theme via CSS variables); swap with `customTooltipRenderer` / `renderMask`
- **No router lock-in** — optional `resetKey` instead of a hard `react-router` dependency

Default **copy is English**. Pass your own `finishBtnText` / `skipBtnText` / labels for other locales (see Persian demo on the showcase).

### Who is this for?

- Product teams shipping **feature onboarding** and **first-run tours**
- Apps that need **RTL** (Persian, Arabic, Hebrew) without fighting LTR-only libraries
- Design systems that refuse locked-in tour chrome (bring your own tooltip / mask)

---

## Requirements

| Peer | Versions |
|------|----------|
| `react` / `react-dom` | `^18` or `^19` |

No other runtime dependencies. Default styles inject automatically; optional override file: `@persianstudio/tourara/styles.css`.

---

## Install

```bash
pnpm add @persianstudio/tourara
# or: npm install / yarn add @persianstudio/tourara
```

The npm package ships **only the compiled library** (`dist/` JS + types + CSS) plus license/READMEs — **not** the showcase demo, docs sources, or TypeScript sources. Install size stays small; the [live demo](https://persianstudio.github.io/tourara/showcase/) is hosted on GitHub Pages. Clone this repo only when contributing.

Until the package is on npm (temporary):

```bash
# Still packs library-only files (no showcase) via package.json "files"
pnpm add github:PersianStudio/tourara
```

Theme the default chrome with CSS variables (`--tourara-accent`, `--tourara-bg`, …) or replace it entirely with slots.

---

## Quick start

### 1. Mark targets in the DOM

```tsx
<nav data-tour="nav">…</nav>
<button data-tour="cta">Save</button>
```

Any CSS selector works (`#id`, `.class`, `[data-tour="…"]`, etc.).

### 2. Context-backed host (recommended for apps)

Wrap once with **TourProvider**. Mount **one** host. Pages register steps; a button (or effect) opens the tour.

```tsx
import {
  TourProvider,
  TourHost,
  useTour,
  useTourContext,
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
  useTour({
    tourOptions: { steps },
    openImmediately: true,
  });

  const { setTourProps } = useTourContext();

  return (
    <button type="button" onClick={() => setTourProps({ isOpen: true })}>
      Start tour
    </button>
  );
}

export function App() {
  return (
    <TourProvider>
      <TourHost resetKey={window.location.pathname} />
      <PageTour />
      <nav data-tour="nav">Home</nav>
      <button data-tour="cta">Save</button>
    </TourProvider>
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
| `TourProvider` | React Context for shared tour props. Wrap the app (or a subtree). |
| `TourHost` | Reads context and renders `Tour`. Mount once under the provider. Optional `resetKey` clears steps and closes when it changes. |
| `Mask` | Default SVG spotlight (also overridable via `renderMask`). |
| `Tooltip` | Default step chrome (title, content, stepper, footer). |
| `Tip` | Inactive-step marker near other visible targets. |

### Hooks & context

| Export | Description |
|--------|-------------|
| `useTour({ tourOptions, delay?, openImmediately? })` | Writes `tourOptions` into context on mount (after `delay` ms, default `100`). Returns `{ tourProps, setTourProps }`. Requires `TourProvider`. |
| `useTourContext` / `useTourStore` | Context API: `{ tourProps, setTourProps }` (`useTourStore` is an alias). |
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

Options can be set on the **tour** (`Tour` / context props) and **overridden per step**.

### Content & chrome

| Option | Type | Notes |
|--------|------|--------|
| `selector` | `string` | **Required** on each step. |
| `title` | `ReactNode` \| `(logic) => ReactNode` | Optional header. |
| `content` | `ReactNode` \| `(logic) => ReactNode` | Step body. |
| `finishBtnText` | `string` | Last-step primary button (default `"Done"`). |
| `skipBtnText` | `string` | Skip label (default `"Skip"`). |
| `noFooter` / `noCloseIcon` / `noSkipBtn` / `noStepper` | `boolean` | Hide parts of the default tooltip. |
| `corner` | `'none' \| 'small'` | Geometry caret aimed at the focus border (`'none'` hides it). |
| `audio` / `video` / `image` | `boolean` | Show media affordance buttons in the default tooltip. |
| `videoBtnText` / `imageBtnText` | `string` | Labels for those buttons. |

### Mask & layout

| Option | Default | Notes |
|--------|---------|--------|
| `maskPadding` | `5` | Gap around the cutout (also used as the caret aim rect). |
| `maskRadius` | `2` | Cutout corner radius. |
| `disableMask` | `false` | Hide the overlay. |
| `disableTips` | `false` | Skip inactive tip markers (cheapest tip mode). |
| `disableMaskInteraction` | `false` | When `true`, mask captures pointer events more aggressively. |
| `disableCloseOnClick` | `false` | Don’t close when clicking the dimmed area. |
| `tooltipMaxWidth` | `min(400px, 100vw-24px)` | Number (px) or CSS length string. |
| `tooltipSeparation` | `10` | Gap from focus border; caret length matches this. |
| `tooltipBorderRadius` | `8` | Tooltip card radius in **px**. |
| `tooltipContainerStyle` / `contentContainerStyle` | — | Plain React `CSSProperties` overrides. |
| `transition` | `top/left 160ms ease` | Tooltip move transition. |
| `zIndex` | `10000` | Portal stacking. |
| `rootSelector` | — | Scroll / portal root; otherwise nearest scroll ancestor. |
| `allowForeignTarget` | `true` | Allow targets outside the tour root. |
| `disableAutoScroll` / `disableSmoothScroll` | `false` | Scroll behavior. |
| `movingTarget` | — | Poll for targets that move/resize (interval floored at 200ms). |
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

Default chrome is plain HTML/CSS. Styles inject automatically when `TourProvider` or `Tour` mounts. Optional stylesheet:

```ts
import '@persianstudio/tourara/styles.css';
```

Override with CSS variables on `:root` or a parent:

| Variable | Role |
|----------|------|
| `--tourara-bg` | Tooltip surface |
| `--tourara-fg` | Tooltip text |
| `--tourara-accent` | Primary buttons + tip markers |
| `--tourara-accent-contrast` | Text on accent |
| `--tourara-warning` | Active stepper pill |
| `--tourara-border` / `--tourara-surface` | Dividers / ghost buttons |
| `--tourara-radius` | Default card radius |

Mask light/dark follows `data-theme="dark"|"light"` on `<html>` (or `prefers-color-scheme`).

For full control, use `customTooltipRenderer` / `renderMask` / `tooltipContainerStyle` / `contentContainerStyle`.

---

## Project structure

```text
tourara/
├── src/                     # Publishable library
│   ├── components/          # Tour, TourHost, Mask, Tooltip, Tip
│   ├── context/             # TourProvider (React Context)
│   ├── hooks/               # useTour, useUpdateTour, useDetectVisible
│   ├── styles/              # Default chrome CSS + inject
│   ├── types/               # TourStep, TourProps, …
│   ├── utils/               # positioning, DOM, tourActions
│   └── index.ts             # Public exports
├── showcase/                # GitHub Pages demo (MUI only here)
├── docs/                    # VitePress docs site (guide + API + internals)
├── .github/workflows/       # Pages deploy (showcase + docs)
├── vite.config.ts           # Library build (ES + CJS + d.ts)
└── vite.showcase.config.ts  # Demo build (base: /tourara/)
```

---

## Local development

```bash
pnpm install
pnpm dev              # Showcase → http://localhost:5173/tourara/
pnpm docs:dev         # Docs → http://localhost:5174/tourara/docs/
pnpm build            # Library → dist/
pnpm build:showcase   # Static demo → showcase-dist/
pnpm docs:build       # VitePress → docs-dist/
pnpm build:pages      # Showcase + docs merged for Pages
pnpm preview          # Preview showcase-dist
pnpm typecheck
pnpm pack:check       # Dry-run npm tarball contents
```

---

## GitHub Pages

Every push to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml): install → build library → build showcase → build docs → merge docs into the Pages artifact → deploy.

| URL | Content |
|-----|---------|
| https://persianstudio.github.io/tourara/ | Redirects to docs |
| https://persianstudio.github.io/tourara/docs/ | Documentation (primary entry) |
| https://persianstudio.github.io/tourara/showcase/ | Interactive showcase |

Enable once: repo **Settings → Pages → Source → GitHub Actions**.

Set the GitHub repo **social preview** / avatar with repo-root `logo.png` under **Settings → General**. The same mark brands docs, showcase, and README.

Details: **[docs/internals/github-pages.md](./docs/internals/github-pages.md)**.

---

## Publishing to npm

Full checklist: **[docs/PUBLISHING.md](./docs/PUBLISHING.md)**.

Short path (requires npm auth + `@persianstudio` publish rights):

```bash
pnpm typecheck && pnpm build && pnpm pack:check
# bump version in package.json (semver), then:
pnpm publish --access public
```

`prepublishOnly` re-runs typecheck + build before upload. Package peers are **only** `react` / `react-dom`.

---

## Extending

- Prefer **slots** (`customTooltipRenderer`, `renderMask`, custom next/prev/close) over editing core files.
- Keep positioning / DOM math in `src/utils`; keep UI in `src/components`.
- Theme via CSS variables first; ship alternate skins later without changing the engine.

---

## Project docs

Full documentation is authored under [`docs/`](./docs/) and published to **[persianstudio.github.io/tourara/docs](https://persianstudio.github.io/tourara/docs/)**.

| Section | Purpose |
|---------|---------|
| [Guide](https://persianstudio.github.io/tourara/docs/guide/getting-started) | Setup, placement, mask, tooltip, tips, RTL, slots, responsive |
| [API](https://persianstudio.github.io/tourara/docs/api/overview) | Exports, components, options, helpers |
| [Internals](https://persianstudio.github.io/tourara/docs/internals/architecture) | Architecture, contributing, npm publish, GitHub Pages, SEO |

Local: `pnpm docs:dev`

---

## Credits

Extracted and open-sourced from the ICE web app tour system by [Persian Studio](https://github.com/PersianStudio).

## License

[MIT](./LICENSE) © Persian Studio
