# Interactive flows

Real apps need tours that open menus, wait for DOM, or advance when the user clicks the highlighted control.

## Click the target to continue

```ts
{
  selector: '[data-tour="cta"]',
  content: 'Click the button to continue.',
  nextOnTargetClick: true,
  // optional:
  validateNextOnTargetClick: async () => /* form valid? */ true,
}
```

## Custom next / prev / close

```ts
customNextFunc: async (logic, fromTarget) => {
  await openSidebar();
  logic.goToStep(logic.stepIndex + 1);
},
customPrevFunc: async (logic) => {
  closeSidebar();
  logic.prev();
},
customCloseFunc: async (logic) => {
  await analytics.track('tour_dismissed');
  logic.close();
},
```

## DOM helpers

```ts
import {
  isElementPresent,
  clickOnElement,
  waitForElement,
  conditionalTourAction,
} from '@persianstudio/tourara';
```

| Helper | Role |
|--------|------|
| `isElementPresent(selector)` | Boolean query |
| `clickOnElement(selector)` | Programmatic click |
| `waitForElement(selector, opts?)` | Poll until present |
| `conditionalTourAction(target, trigger, onReady, onTimeout, …)` | Click trigger if needed, wait for target, then run callbacks |

### Menu pattern

```ts
customNextFunc: async (logic) => {
  await conditionalTourAction(
    '[data-tour="menu-item"]',
    '[data-tour="menu-trigger"]',
    () => logic.goToStep(logic.stepIndex + 1),
    () => logic.goToStep(logic.stepIndex + 1),
    80,
    220,
  );
},
```

## Moving targets

```ts
{
  selector: '[data-tour="orb"]',
  movingTarget: true,
  updateInterval: 400, // floor is 200ms in the engine
}
```

Geometry updates without rebinding listeners every tick.

## Disable controls

```ts
disableNext?: boolean
disablePrev?: boolean
disableClose?: boolean
```
