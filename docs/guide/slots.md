# Render slots

Own the UI without forking the engine. Slots receive `TourLogic` so navigation stays wired.

## Tooltip chrome

Replace the entire card:

```tsx
customTooltipRenderer: (logic) => (
  <div className="my-tour-card">
    <h2>{logic?.stepContent.title}</h2>
    <div>{logic?.stepContent.content}</div>
    <button type="button" onClick={() => logic?.prev()}>Back</button>
    <button type="button" onClick={() => logic?.next()}>Next</button>
  </div>
)
```

Placement, mask, tips, and keyboard still run. Only the default HTML chrome is swapped.

## Footer only

Keep header/body/stepper; replace Skip / chevrons:

```tsx
customFooterRenderer: (logic) => (
  <div className="row">
    <button type="button" onClick={() => logic?.close(true)}>Exit</button>
    <button type="button" onClick={() => logic?.next()}>Continue</button>
  </div>
)
```

## Title / content renderers

```ts
customTitleRenderer?: (tourLogic?) => ReactNode
customContentRenderer?: (tourLogic?) => ReactNode
```

## Mask

```tsx
renderMask: (maskOptions) => <BrandMask {...maskOptions} />
```

## Mobile-friendly custom UI

When building custom footers/tooltips:

- Prefer `flex-wrap` and `maxWidth: 'min(360px, calc(100vw - 32px))'`
- Keep tap targets ≥ 40px
- Don’t assume desktop-only `EAST` / `WEST` placement — see [Responsive](./responsive)
