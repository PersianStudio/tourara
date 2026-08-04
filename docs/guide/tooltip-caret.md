# Tooltip & caret

Default chrome is plain HTML + CSS variables (no MUI). Replace it entirely with `customTooltipRenderer` when you need a branded skin — see [Render slots](./slots).

## Default structure

1. **Header** — title, optional close  
2. **Body** — scrollable content  
3. **Stepper** — dots for each step (scrolls horizontally on narrow widths)  
4. **Footer** — Skip / Done + prev/next  

Toggle pieces with `noFooter`, `noCloseIcon`, `noSkipBtn`, `noStepper`.

## Caret (`corner`)

| Value | Behavior |
|-------|----------|
| `'small'` (default) | Geometry caret on the facing edge or corner |
| `'none'` | Hide the caret |

The caret:

- Aims at the nearest point on the **padded** focus rect (`target + maskPadding`)
- Uses a short triangle whose length matches `tooltipSeparation`
- On diagonal layouts, sits on the facing **corner** and rotates toward the focus
- Uses **destination** shell coordinates during CSS transitions so it does not detach mid-move

## Sizing

| Option | Notes |
|--------|--------|
| `tooltipMaxWidth` | Number (px) or CSS string; clamped with `min(..., 100vw - 24px)` |
| `tooltipBorderRadius` | Card radius in px |
| `tooltipContainerStyle` | Inline styles on the positioned shell |
| `contentContainerStyle` | Inline styles on the body scroll area |

On small screens the shell drops `min-width`, raises body max-height, and wraps the footer. See [Responsive](./responsive).

## Keyboard

| Key | Action |
|-----|--------|
| `Escape` | Close (unless `disableClose`) |
| `ArrowRight` / `ArrowLeft` | Next / prev (swapped for RTL reading order) |

Focus is trapped toward the tooltip while the tour is open; body scroll inside the tooltip remains allowed on touch devices.
