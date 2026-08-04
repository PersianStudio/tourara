# tourara

React product-tour toolkit — SVG masks, smart tooltip placement, tip markers, and a store-backed host.

**Package:** `@persianstudio/tourara`  
**Demo:** [persianstudio.github.io/tourara](https://persianstudio.github.io/tourara/)  
**License:** MIT

## Install

```bash
pnpm add @persianstudio/tourara @mui/material @emotion/react @emotion/styled
# peers: react, react-dom (^18 || ^19)
```

> Not published to npm yet — for now install from GitHub or link the local package.

```bash
pnpm add github:PersianStudio/tourara
```

## Quick start (store + TourHost)

Mount the host once near your app root, register steps on a page, then open the tour.

```tsx
import {
  TourHost,
  useTour,
  useTourStore,
  type TourStep,
} from "@persianstudio/tourara";

const steps: TourStep[] = [
  {
    selector: '[data-tour="nav"]',
    title: "Navigation",
    content: "This is your primary nav.",
  },
  {
    selector: '[data-tour="cta"]',
    title: "Call to action",
    content: "Click next when you are ready.",
  },
];

function PageTour() {
  useTour({ tourOptions: { steps }, openImmediately: true });
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
      <TourHost />
      <PageTour />
      <nav data-tour="nav">…</nav>
      <button data-tour="cta">Save</button>
    </>
  );
}
```

Pass `resetKey={location.pathname}` to `<TourHost />` if you want the tour to clear on navigation (no `react-router` dependency inside tourara).

## Controlled `<Tour />`

```tsx
import { Tour, type TourStep } from "@persianstudio/tourara";

function Controlled({ open, onClose }: { open: boolean; onClose: () => void }) {
  const steps: TourStep[] = [
    /* … */
  ];
  return <Tour steps={steps} isOpen={open} onClose={() => onClose()} />;
}
```

## API surface

| Export                                                                          | Role                                   |
| ------------------------------------------------------------------------------- | -------------------------------------- |
| `Tour`                                                                          | Controlled tour overlay                |
| `TourHost`                                                                      | Store-bound host (former DsTour)       |
| `useTour`                                                                       | Register steps into the store on mount |
| `useTourStore` / `createTourStore`                                              | Zustand store                          |
| `Mask`, `Tooltip`, `Tip`                                                        | Building blocks / customization        |
| `CardinalOrientation`                                                           | Placement enum                         |
| `waitForElement`, `clickOnElement`, `conditionalTourAction`, `isElementPresent` | DOM helpers for interactive steps      |
| `tourDefaultProps`                                                              | Default options                        |

### Step shape (essentials)

```ts
interface TourStep {
  selector: string;
  title?: ReactNode | ((logic?: TourLogic) => ReactNode);
  content: ReactNode | ((logic?: TourLogic) => ReactNode);
  orientationPreferences?: CardinalOrientation[];
  customNextFunc?: (logic: TourLogic) => Promise<void>;
  nextOnTargetClick?: boolean;
  // …plus mask/tooltip/footer overrides — see TourOptions
}
```

Slots for extension: `customTooltipRenderer`, `customFooterRenderer`, `renderMask`, `customNextFunc` / `customPrevFunc` / `customCloseFunc`.

## Local development

```bash
pnpm install
pnpm dev              # showcase at http://localhost:5173/tourara/
pnpm build            # library → dist/
pnpm build:showcase   # GitHub Pages bundle → showcase-dist/
```

## GitHub Pages

CI deploys the showcase on every push to `main` via [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

In the repo: **Settings → Pages → Source → GitHub Actions**.

## Extending

- Keep engine utils under `src/utils` and UI under `src/components`.
- Prefer render slots over forking Tooltip when theming.
- Future skins can live as separate entry points (e.g. CSS-only) without changing the positioning core.

## Credits

Extracted and open-sourced from the ICE web app tour system by [Persian Studio](https://github.com/PersianStudio).
