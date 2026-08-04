# Theming

Default chrome is styled with CSS variables on `:root` / the portal.

## Variables

| Variable | Role |
|----------|------|
| `--tourara-bg` | Tooltip background |
| `--tourara-fg` | Text |
| `--tourara-muted` | Secondary text |
| `--tourara-border` | Dividers |
| `--tourara-surface` | Ghost button surface |
| `--tourara-accent` | Primary button / tip fill |
| `--tourara-accent-contrast` | Text on accent |
| `--tourara-warning` | Active stepper pill |
| `--tourara-radius` | Default radius |
| `--tourara-font` | Font stack |

Example:

```css
:root {
  --tourara-bg: #0f172a;
  --tourara-accent: #38bdf8;
  --tourara-accent-contrast: #0b1220;
}
```

## Stylesheet entry

Runtime inject covers most apps. For CSP or SSR control:

```ts
import '@persianstudio/tourara/styles.css';
```

## Full replacement

When variables aren’t enough, use [`customTooltipRenderer`](./slots) / `renderMask` and ignore default chrome entirely.
