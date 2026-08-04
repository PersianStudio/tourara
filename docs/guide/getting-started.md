# Getting started

**tourara** (`@persianstudio/tourara`) is a React product-tour and onboarding library. It draws an SVG spotlight over the page, places a tooltip near the focused element, and optionally shows tip markers on other steps.

Peers are **React 18/19 only** — no MUI, no Zustand, no router lock-in.

## Install

```bash
pnpm add @persianstudio/tourara
# npm i @persianstudio/tourara
# yarn add @persianstudio/tourara
```

The npm package ships compiled `dist/` (JS, types, CSS) plus license/READMEs — **not** the showcase or this docs source tree.

Styles inject automatically when you open a tour. Optional static import:

```ts
import '@persianstudio/tourara/styles.css';
```

## Mark targets

```tsx
<nav data-tour="nav">…</nav>
<button data-tour="cta">Save</button>
```

Any CSS selector works. Prefer stable anchors like `[data-tour="…"]` so layout refactors do not break tours.

## Two ways to run a tour

### A. Host mode (apps / multi-page)

Wrap once, mount `<TourHost />`, register steps with `useTour` or `setTourProps`:

```tsx
import { TourProvider, TourHost, useTourContext } from '@persianstudio/tourara';
import type { TourStep } from '@persianstudio/tourara';

const steps: TourStep[] = [
  {
    selector: '[data-tour="nav"]',
    title: 'Navigation',
    content: 'Jump anywhere from here.',
  },
  {
    selector: '[data-tour="cta"]',
    title: 'Save',
    content: 'Persist your changes.',
    finishBtnText: 'Done',
  },
];

function App() {
  return (
    <TourProvider>
      <TourHost />
      <Page />
    </TourProvider>
  );
}

function Page() {
  const { setTourProps } = useTourContext();
  return (
    <button
      type="button"
      onClick={() => setTourProps({ steps, isOpen: true })}
    >
      Start tour
    </button>
  );
}
```

Or register on mount with `useTour({ tourOptions: { steps, isOpen: false } })`.

### B. Controlled `<Tour />`

Own open state yourself (modals, tests, Storybook):

```tsx
import { useState } from 'react';
import { Tour } from '@persianstudio/tourara';

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Tour
        steps={steps}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
```

## Minimal step shape

```ts
type TourStep = {
  selector: string;          // required — CSS selector for the target
  content: ReactNode;        // required — body copy or custom render
  title?: ReactNode;         // optional header
  // …plus any TourOptions override for this step only
};
```

Step-level options override tour-level options when both are set.

## Next steps

- [Host vs controlled](./host-vs-controlled) — when to pick each mode
- [Steps & selectors](./steps) — content, media flags, labels
- [Placement](./placement) — orientations and caret aim
- [Live demo](https://persianstudio.github.io/tourara/) — full walkthrough on GitHub Pages
