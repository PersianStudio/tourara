# Contributing

Thanks for helping improve tourara. This guide keeps the codebase easy to evolve.

## Prerequisites

- Node 18+ (CI uses 22)
- pnpm 9 (`packageManager` in `package.json`)

```bash
pnpm install
pnpm dev            # showcase
pnpm typecheck
pnpm build          # library → dist/
pnpm build:showcase # Pages bundle
pnpm pack:check     # dry-run npm tarball
```

## Principles

1. **Keep `src/index.ts` stable** — public exports are the contract.
2. **Small files** — prefer focused modules over 300+ line components.
3. **Pure helpers** — geometry / path / placement logic stays free of React when possible.
4. **Comment the why** — short file headers + non-obvious function JSDoc.
5. **Defaults stay English + LTR** — localization is caller-owned via props.
6. **Zero UI peers** — library chrome is HTML/CSS + CSS variables; MUI stays in `showcase/` only.
7. **Context for host mode** — `TourProvider` / `useTourContext` (no Zustand).
8. **Match existing patterns** — fixed portal viewport coords, geometry-first pointer, rAF-throttled tips.
9. **Library ≠ showcase** — `src/` never imports from `showcase/`. npm ships only `dist/` (+ license/READMEs); see [PUBLISHING.md](./PUBLISHING.md).

## Repo layout

| Path | Role |
|------|------|
| `src/` | Publishable library source (built to `dist/`) |
| `dist/` | Build output — what npm installs (gitignored) |
| `showcase/` | Demo app only (Pages / `pnpm dev`) — **not** in the npm tarball |
| `docs/` | Maintainer docs — **not** in the npm tarball |
| `scripts/` | Release helpers (e.g. `assert-npm-pack.mjs`) |

```bash
pnpm build          # library → dist/   (what consumers get)
pnpm build:showcase # demo → showcase-dist/  (GitHub Pages only)
pnpm pack:check     # assert tarball has no showcase/src/docs/maps
```

## Where to change what

| Goal | Start here |
|------|------------|
| Tooltip UI / caret | `src/components/Tooltip/` |
| Tip markers | `src/components/Tip/` |
| Mask / cutout | `src/components/Mask/` |
| Step flow / keyboard | `src/components/Tour/` |
| Shared tour state | `src/context/TourContext.tsx` |
| Placement math | `src/utils/positioning/` |
| Update loop | `src/hooks/useUpdateTour/` |
| Default styles | `src/styles/tourara.css` |
| Demo pages | `showcase/demo/`, `showcase/sections/` |
| npm release | [PUBLISHING.md](./PUBLISHING.md) |

## Pull requests

- Run `pnpm typecheck && pnpm build && pnpm build:showcase` before pushing.
- Prefer focused PRs (engine vs showcase vs docs).
- Update `README.md` / `README.fa.md` / `docs/` when behavior or public API changes.
- Do not commit `dist/` or `showcase-dist/` (gitignored).

## Code style

- TypeScript strict; avoid new `any` unless matching legacy `@ts-nocheck` geometry files.
- Named exports for components.
- No new runtime dependencies without a clear need (keep the package lean — peers are React only).

## Publishing

Maintainers: follow [PUBLISHING.md](./PUBLISHING.md) end-to-end before `pnpm publish`.

## License

By contributing you agree your work is released under the MIT license.
