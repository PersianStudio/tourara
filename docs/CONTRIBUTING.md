# Contributing

Thanks for helping improve tourara. This guide keeps the codebase easy to evolve.

## Prerequisites

- Node 20+ (CI uses 22)
- pnpm 9 (`packageManager` in `package.json`)

```bash
pnpm install
pnpm dev            # showcase
pnpm typecheck
pnpm build          # library → dist/
pnpm build:showcase # Pages bundle
```

## Principles

1. **Keep `src/index.ts` stable** — public exports are the contract.
2. **Small files** — prefer focused modules over 300+ line components.
3. **Pure helpers** — geometry / path / placement logic stays free of React when possible.
4. **Comment the why** — short file headers + non-obvious function JSDoc.
5. **Defaults stay English + LTR** — localization is caller-owned via props.
6. **Match existing patterns** — MUI `sx`, Zustand store for host mode, fixed portal coords.

## Where to change what

| Goal | Start here |
|------|------------|
| Tooltip UI | `src/components/Tooltip/` |
| Tip markers | `src/components/Tip/` |
| Mask / cutout | `src/components/Mask/` |
| Step flow / keyboard | `src/components/Tour/` |
| Placement math | `src/utils/positioning/` |
| Update loop | `src/hooks/useUpdateTour/` |
| Store / useTour | `src/store/`, `src/hooks/useTour.tsx` |
| Demo pages | `showcase/demo/`, `showcase/sections/` |

## Pull requests

- Run `pnpm typecheck && pnpm build && pnpm build:showcase` before pushing.
- Prefer focused PRs (engine vs showcase vs docs).
- Update `README.md` / `README.fa.md` / `docs/` when behavior or public API changes.
- Do not commit `dist/` or `showcase-dist/` (gitignored).

## Code style

- TypeScript strict; avoid new `any` unless matching legacy `@ts-nocheck` geometry files.
- Named exports for components; default only when matching an existing pattern (`TourHost` historically named).
- No new dependencies without a clear need (keep the package lean).

## License

By contributing you agree your work is released under the MIT license.
