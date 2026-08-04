# Mask & spotlight

The mask is a full-viewport SVG overlay with a cutout (hole) around the active target.

## Options

| Option | Default | Meaning |
|--------|---------|---------|
| `maskPadding` | `5` | Extra space around the target in the cutout |
| `maskRadius` | `2` | Corner radius of the cutout |
| `disableMask` | `false` | Hide the overlay entirely |
| `disableMaskInteraction` | `false` | When `true`, mask captures pointer events more aggressively |
| `disableCloseOnClick` | `false` | Backdrop click does not close |
| `renderMask` | — | Replace the default SVG mask component |

## Behavior

- Fill opacity adapts to light/dark (`data-theme` / `prefers-color-scheme`)
- Cutout + border stroke track the target through scroll and resize
- Portal uses `dvh` / safe-area aware sizing on modern browsers

## Custom mask

```tsx
renderMask={(opts) => <MyMask {...opts} />}
```

`MaskOptions` includes `targetInfo`, `padding`, `radius`, `tourRoot`, `close`, etc.

## No mask

```ts
{ disableMask: true, corner: 'none' }
```

Useful for welcome steps that introduce the product without spotlighting a control.
