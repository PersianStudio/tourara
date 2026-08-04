# Options & steps

Defaults live in `tourDefaultProps` (`direction: 'ltr'`, `corner: 'small'`, `maskPadding: 5`, `tooltipSeparation: 10`, …).

Merge order: **defaults → `<Tour />` / host props → current step**.

## `TourOptions` (shared by tour + step)

### Direction & chrome

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `direction` | `'ltr' \| 'rtl'` | `'ltr'` | Mirrors E/W prefs in RTL; sets `dir` |
| `corner` | `'small' \| 'none'` | `'small'` | Geometry caret |
| `noFooter` / `noCloseIcon` / `noSkipBtn` / `noStepper` | `boolean` | `false` | Hide default pieces |
| `finishBtnText` / `skipBtnText` | `string` | English | Button labels |
| `videoBtnText` / `imageBtnText` | `string` | — | Media affordance labels |
| `prevLabel` / `nextLabel` / `closeLabel` | `string` | a11y defaults | Icon button labels |
| `transition` | `string` | `top/left 160ms` | Shell CSS transition |

### Mask

| Option | Type | Default |
|--------|------|---------|
| `maskPadding` | `number` | `5` |
| `maskRadius` | `number` | `2` |
| `disableMask` | `boolean` | `false` |
| `disableMaskInteraction` | `boolean` | `false` |
| `disableCloseOnClick` | `boolean` | `false` |
| `renderMask` | `(opts) => ReactElement` | — |

### Placement

| Option | Type | Default |
|--------|------|---------|
| `orientationPreferences` | `CardinalOrientation[]` | — |
| `tooltipSeparation` | `number` | `10` |
| `tooltipMaxWidth` | `string \| number` | CSS / px |
| `tooltipBorderRadius` | `number` | `8` |
| `tooltipContainerStyle` | `CSSProperties` | — |
| `contentContainerStyle` | `CSSProperties` | — |
| `disableAutoScroll` | `boolean` | `false` |
| `disableSmoothScroll` | `boolean` | `false` |
| `allowForeignTarget` | `boolean` | `true` |
| `getPositionFromCandidates` | `(cands) => OrientationCoords` | — |

### Tips

| Option | Type | Default |
|--------|------|---------|
| `disableTips` | `boolean` | `false` |
| `tipOrientationPreferences` | `CardinalOrientation[]` | — |

### Slots & actions

| Option | Type |
|--------|------|
| `customTitleRenderer` | `(logic?) => ReactNode` |
| `customContentRenderer` | `(logic?) => ReactNode` |
| `customFooterRenderer` | `(logic?) => ReactNode` |
| `customTooltipRenderer` | `(logic?) => ReactNode` |
| `customNextFunc` | `(logic, fromTarget?) => Promise<void>` |
| `customPrevFunc` | `(logic) => Promise<void>` |
| `customCloseFunc` | `(logic) => Promise<void>` |
| `nextOnTargetClick` | `boolean` |
| `validateNextOnTargetClick` | `() => Promise<boolean>` |
| `disableNext` / `disablePrev` / `disableClose` | `boolean` |

### Moving targets

| Option | Type | Notes |
|--------|------|-------|
| `movingTarget` | `boolean` | Poll geometry |
| `updateInterval` | `number` | Floor **200ms** |
| `renderTolerance` | `number` | Default `2` — dirty check threshold |

## `TourStep`

Extends `TourOptions` with:

| Field | Required | Notes |
|-------|----------|-------|
| `selector` | yes | CSS selector |
| `content` | yes | Node or render fn |
| `title` | no | Node or render fn |
| `audio` / `video` / `image` | no | Media flags |

## `TourProps`

Extends `TourOptions` with:

| Field | Notes |
|-------|--------|
| `steps` | Required array |
| `isOpen` | Controlled open flag |
| `onClose` | `(reset?: boolean) => void` |
| `initialStepIndex` | Starting index |
| `resetKey` | Change → jump to step 0 |
| `zIndex` | Portal stacking |
| `rootSelector` | Custom scroll/clip root |
| `identifier` | DOM id suffix for multiple tours |
| `disableListeners` | Skip resize/scroll bindings |
| `setUpdateListener` / `removeUpdateListener` | Custom update wiring |
