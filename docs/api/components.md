# Components & hooks

## `TourProvider`

Provides `{ tourProps, setTourProps }` to descendants. Required for host mode.

```tsx
<TourProvider>{children}</TourProvider>
```

## `TourHost`

Renders a context-bound `<Tour />`. Mount **once** under the provider.

```tsx
<TourHost resetKey={location.pathname} />
```

## `Tour`

Orchestrates mask, tooltip, tips, keyboard, and scroll lock.

| Prop group | Examples |
|------------|----------|
| Required | `steps` |
| Open state | `isOpen`, `onClose` |
| Navigation reset | `initialStepIndex`, `resetKey` |
| All `TourOptions` | See [Options](./options) |

## `Mask` / `Tooltip` / `Tip`

Exported for advanced composition and `renderMask`. Most apps never import them directly.

## `useTour`

```ts
useTour({
  tourOptions: { steps, isOpen: false, direction: 'ltr' },
  openImmediately?: boolean,
})
```

Writes into context on mount. Returns `{ tourProps, setTourProps }`.

## `useTourContext` / `useTourStore`

```ts
const { tourProps, setTourProps } = useTourContext();
```

`useTourStore` is an alias kept for compatibility.

## Advanced hooks

| Hook | Role |
|------|------|
| `useUpdateTour` | Internal placement / listener loop |
| `useDetectVisibility` | IntersectionObserver helper |

Prefer public tour APIs unless you are extending the engine.
