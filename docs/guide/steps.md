# Steps & selectors

Each entry in `steps` focuses one DOM target and shows one tooltip.

## Required fields

| Field | Type | Notes |
|-------|------|--------|
| `selector` | `string` | CSS selector resolved in the tour root (or `document` when `allowForeignTarget`) |
| `content` | `ReactNode` or `(logic) => ReactNode` | Body of the step |

## Optional content

| Field | Notes |
|-------|--------|
| `title` | Header text or render function |
| `audio` / `video` / `image` | Flags that show media affordances in the default chrome |
| `finishBtnText` / `skipBtnText` | Labels (default English) |
| `prevLabel` / `nextLabel` / `closeLabel` | a11y labels for icon buttons |

## Per-step option overrides

A step may include any [`TourOptions`](../api/options) field. Merged order: **defaults → tour props → step**.

```ts
{
  selector: '[data-tour="hero"]',
  title: 'Welcome',
  content: 'Start here.',
  maskPadding: 12,
  orientationPreferences: [CardinalOrientation.SOUTH],
  corner: 'none',
}
```

## Selectors that survive refactors

Prefer:

```html
<button data-tour="save">Save</button>
```

```ts
selector: '[data-tour="save"]'
```

Avoid brittle paths like `.css-module_x > div:nth-child(3)` unless you control them.

## Missing targets

If the selector is not found:

- Mask may show without a cutout
- Tooltip still opens (centered / clamped)
- Use `waitForElement` / `conditionalTourAction` for targets that appear after a click — see [Interactive flows](./interactive)

## `TourLogic` in renderers

Title, content, and custom slots receive optional `TourLogic`:

```ts
{
  next, prev, skip, close, goToStep,
  stepIndex, allSteps, stepContent,
  tooltipPosition, direction, …
}
```

Use it for custom footers that call `logic.next()` or disable buttons from `stepIndex`.
