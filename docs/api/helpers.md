# DOM helpers

Utilities for interactive steps. Import from `@persianstudio/tourara`.

## `isElementPresent`

```ts
isElementPresent(selector: string): boolean
```

## `clickOnElement`

```ts
clickOnElement(selector: string): void
```

Programmatic click on the first match.

## `waitForElement`

```ts
waitForElement(
  selector: string,
  options?: { timeout?: number; interval?: number }
): Promise<Element>
```

Polls until the node exists or rejects on timeout.

## `conditionalTourAction`

```ts
conditionalTourAction(
  targetSelector: string,
  triggerSelector: string,
  onReady: () => void,
  onTimeout: () => void,
  interval?: number,
  timeout?: number,
): Promise<void>
```

Pattern:

1. If `targetSelector` is already present → `onReady`
2. Else click `triggerSelector`, wait for target → `onReady`
3. On timeout → `onTimeout`

Used heavily for overflow menus and nested UI. See [Interactive flows](../guide/interactive).
