# RTL & LTR

Tourara treats direction as a first-class option.

```ts
direction: 'ltr' | 'rtl'  // default 'ltr'
```

## What changes in RTL

1. **Chrome** — tooltip shell and card use `dir="rtl"` (text alignment, footer order)  
2. **Placement** — east/west entries in `orientationPreferences` (and tip prefs) are mirrored  
3. **Keyboard** — left/right navigation follows reading order  

Helpers you can call yourself:

```ts
import {
  mirrorOrientation,
  resolveOrientationPreferences,
  defaultTipOrientations,
} from '@persianstudio/tourara';
```

## Localization

Default copy is English (`Skip`, `Done`, …). Pass your own strings:

```ts
{
  direction: 'rtl',
  finishBtnText: 'پایان',
  skipBtnText: 'رد شدن',
  prevLabel: 'قبلی',
  nextLabel: 'بعدی',
  closeLabel: 'بستن',
}
```

The [live demo](https://persianstudio.github.io/tourara/#rtl) includes a Persian RTL walkthrough.
