# Host vs controlled mode

Tourara supports two integration styles. Pick one per surface — mixing both on the same page is rarely needed.

## Host mode (`TourProvider` + `TourHost`)

**Use when:** the tour spans multiple routes or screens, several features register their own steps, or you want a single portal owned by the app shell.

```tsx
<TourProvider>
  <TourHost />
  <Router>…</Router>
</TourProvider>
```

| Piece | Role |
|-------|------|
| `TourProvider` | Holds `{ tourProps, setTourProps }` in React context |
| `TourHost` | Renders `<Tour />` from context when `isOpen` |
| `useTour` | Writes options into context on mount (optional `openImmediately`) |
| `useTourContext` / `useTourStore` | Read/write `tourProps` from any child |

Typical flow:

1. Shell mounts `TourProvider` + `TourHost` once.
2. A feature page calls `setTourProps({ steps, isOpen: true, … })` or `useTour({…})`.
3. Closing calls `onClose` via host wiring / `setTourProps({ isOpen: false })`.

`resetKey` on tour props jumps back to step `0` when it changes — pass a pathname to restart after navigation without depending on `react-router` inside the library.

## Controlled mode (`<Tour />`)

**Use when:** a self-contained demo, modal, Storybook story, or test owns open state.

```tsx
<Tour
  steps={steps}
  isOpen={open}
  onClose={(reset) => {
    setOpen(false);
    if (reset) setStepExtras(…);
  }}
/>
```

No provider required if you pass `onClose`. Keyboard, mask, tips, and placement still run through the same engine.

## Comparison

| Concern | Host | Controlled |
|---------|------|------------|
| Open state | Context (`setTourProps`) | Your `useState` |
| Multi-page | Natural | You remount or keep one parent open |
| Tests / Storybook | Heavier | Prefer this |
| Provider required | Yes | No (with `onClose`) |

## Tips

- Always pass **`onClose`** in controlled mode so Esc / backdrop / Done clear your state.
- In host mode, avoid mounting multiple `TourHost`s.
- Alias `useTourStore` exists for older call sites — prefer `useTourContext`.
