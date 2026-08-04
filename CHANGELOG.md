# Changelog

All notable changes to `@persianstudio/tourara` are documented here.

## 0.1.0

First public release.

### Features

- Controlled `<Tour />` and context-backed `<TourProvider>` + `<TourHost />` + `useTour`
- SVG spotlight mask, smart placement, tip markers, keyboard navigation
- RTL / LTR via `direction`
- Geometry caret aimed at the focus border (`corner: 'small' | 'none'`)
- Render slots: `customTooltipRenderer`, `customFooterRenderer`, `renderMask`, custom next/prev/close
- DOM helpers: `waitForElement`, `conditionalTourAction`, …
- **Peers:** `react` / `react-dom` only (no MUI, no Zustand)

### Docs

- English + Persian READMEs
- `docs/` — architecture, API map, contributing, publishing
- npm tarball is library-only (`dist/` + license/READMEs); showcase/docs/src never ship to consumers
