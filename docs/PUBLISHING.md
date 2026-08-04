# Publishing to npm

Guide for releasing `@persianstudio/tourara` to the public npm registry.

## Prerequisites

- npm account with publish rights to the `@persianstudio` org (or your scope)
- Logged in locally: `npm login` (or `npm whoami` to verify)
- Clean `main` (or release branch) with docs/showcase in sync
- Node 18+ / pnpm 9

## What gets published

From `package.json` → `files`:

| Path | Why |
|------|-----|
| `dist/` | ES + CJS bundles, rolled-up `index.d.ts`, `tourara.css` |
| `LICENSE` | MIT |
| `README.md` / `README.fa.md` | npm package page |

**Not** published: `src/`, `showcase/`, `docs/`, `node_modules/`, lockfile (npm uses `files` + `.gitignore` rules).

Peers only:

```json
"react": "^18 || ^19",
"react-dom": "^18 || ^19"
```

No runtime dependencies. Default chrome CSS injects at runtime; optional:

```ts
import '@persianstudio/tourara/styles.css';
```

## Pre-flight checklist

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm build:showcase
pnpm pack:check          # lists tarball contents — confirm no src/secrets
```

Manual checks:

- [ ] README install / Quick start use `TourProvider` (not Zustand / MUI peers)
- [ ] `docs/API.md` matches `src/index.ts` exports
- [ ] Showcase runs (`pnpm dev`) and main tour / RTL / controlled demos work
- [ ] Version in `package.json` bumped appropriately (semver)
- [ ] `CHANGELOG.md` updated (if you maintain one)

## Version bumps

| Change | Bump |
|--------|------|
| Bugfix, docs, perf (compatible) | `0.1.x` patch |
| New options / exports (compatible) | `0.x.0` minor |
| Breaking API / peer changes | `1.0.0` (or major) |

```bash
# example
pnpm version patch   # or minor / major — updates package.json + git tag
```

## Publish

`prepublishOnly` / `prepack` already run typecheck + build.

```bash
# First public release under the org scope
pnpm publish --access public

# Later releases (access already public)
pnpm publish
```

Dry-run without uploading:

```bash
npm publish --dry-run
# or
pnpm pack:check
```

## After publish

1. Confirm https://www.npmjs.com/package/@persianstudio/tourara
2. Smoke-test in a throwaway app:

```bash
pnpm add @persianstudio/tourara
```

```tsx
import { TourProvider, TourHost, useTourContext } from '@persianstudio/tourara';
```

3. Tag the release on GitHub (if not done by `pnpm version`)
4. Optionally announce / update the Pages demo if showcase changed

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `402 Payment Required` / forbidden scope | Ensure org membership + 2FA; use `--access public` for scoped packages |
| Wrong files in tarball | Check `files` + that `pnpm build` left a clean `dist/` (no `src/` tree) |
| Types resolve to missing paths | Build must use vite-plugin-dts `rollupTypes` (single `dist/index.d.ts`) — do not re-run loose `tsc` emit into `dist/` |
| Consumers miss styles | Styles inject via `TourProvider` / `Tour`; or `import '@persianstudio/tourara/styles.css'` |

## Related docs

- [CONTRIBUTING.md](./CONTRIBUTING.md) — day-to-day development
- [API.md](./API.md) — export map
- [../README.md](../README.md) — end-user install & API
