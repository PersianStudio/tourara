# Contributing

Thanks for helping improve tourara.

## Prerequisites

- Node 18+ (CI uses 22)
- pnpm 9 (`packageManager` in `package.json`)

```bash
pnpm install
pnpm dev              # showcase
pnpm docs:dev         # VitePress docs
pnpm typecheck
pnpm build            # library → dist/
pnpm build:showcase   # demo → showcase-dist/
pnpm docs:build       # docs → docs-dist/
pnpm pack:check
```

## Principles

1. Keep `src/index.ts` stable — public exports are the contract  
2. Small files — prefer focused modules  
3. Pure helpers for geometry when possible  
4. Comment the *why*  
5. Defaults stay English + LTR — localization is caller-owned  
6. Zero UI peers in `src/` — MUI only in `showcase/`  
7. Context for host mode (no Zustand)  
8. Library ≠ showcase ≠ docs for npm — only `dist/` ships to the registry  

## Where to change what

| Goal | Start here |
|------|------------|
| Tooltip / caret | `src/components/Tooltip/` |
| Tips | `src/components/Tip/` |
| Mask | `src/components/Mask/` |
| Step flow | `src/components/Tour/` |
| Placement | `src/utils/positioning/` |
| Update loop | `src/hooks/useUpdateTour/` |
| Styles | `src/styles/tourara.css` |
| Demo | `showcase/` |
| Docs site | `docs/` (VitePress) |

## Pull requests

- Run `pnpm typecheck && pnpm build && pnpm build:showcase && pnpm docs:build`  
- Prefer focused PRs (engine vs showcase vs docs)  
- Update README + docs when public API or behavior changes  
- Do not commit `dist/`, `showcase-dist/`, or `docs-dist/`  

## License

By contributing you agree your work is released under the MIT license.
