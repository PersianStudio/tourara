# Publishing to npm

Guide for releasing `@persianstudio/tourara` to the public npm registry.

## Prerequisites

- npm account with publish rights to the `@persianstudio` org (or your scope)
- Logged in locally: `npm login` (or `npm whoami` to verify)
- Clean `main` (or release branch) with docs/showcase in sync
- Node 18+ / pnpm 9

## What gets published (library only)

Consumers who `pnpm add @persianstudio/tourara` must **never** receive the showcase, docs tree, or TypeScript sources.

Authoritative allowlist — `package.json` → `files`:

| Path | Why |
|------|-----|
| `dist/index.js` | ESM bundle |
| `dist/index.cjs` | CJS bundle |
| `dist/index.d.ts` | Rolled-up types |
| `dist/tourara.css` | Optional stylesheet entry (`@persianstudio/tourara/styles.css`) |
| `LICENSE` | MIT |
| `README.md` / `README.fa.md` | npm package page |
| `CHANGELOG.md` | Release notes |

**Explicitly excluded** (also listed in `.npmignore`): `src/`, `showcase/`, `showcase-dist/`, `docs/`, `scripts/`, sourcemaps (`*.map`), configs, lockfiles.

`pnpm pack:check` (`scripts/assert-npm-pack.mjs`) fails the release if anything else lands in the tarball. `prepublishOnly` runs it automatically.

Peers only:

```json
"react": "^18 || ^19",
"react-dom": "^18 || ^19"
```

No runtime dependencies. Default chrome CSS injects at runtime; optional:

```ts
import '@persianstudio/tourara/styles.css';
```

## Repo layout vs install

| Path | In git clone | In npm install |
|------|--------------|----------------|
| `src/` | yes (library source) | **no** |
| `dist/` | build artifact (gitignored) | **yes** (built on publish) |
| `showcase/` | yes (demo app; MUI allowed here only) | **no** |
| `docs/` | yes | **no** |

Showcase aliases `@persianstudio/tourara` → `src/` for local development (`vite.showcase.config.ts`). The library never imports from `showcase/`.

## Pre-flight checklist

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm build:showcase
pnpm pack:check          # must print library-only file list
```

Manual checks:

- [ ] README install / Quick start use `TourProvider` (not Zustand / MUI peers)
- [ ] `docs/API.md` matches `src/index.ts` exports
- [ ] Showcase runs (`pnpm dev`) and main tour / RTL / controlled demos work
- [ ] Version in `package.json` bumped appropriately (semver)
- [ ] `CHANGELOG.md` updated (if you maintain one)
- [ ] `pack:check` shows no `showcase/`, `src/`, or `*.map`

## Version bumps

| Change | Bump |
|--------|------|
| Bug fix, docs, perf (compatible) | `0.1.x` patch |
| New options / exports (compatible) | `0.x.0` minor |
| Breaking API / peer changes | `1.0.0` (or major) |

```bash
# example
pnpm version patch   # or minor / major — updates package.json + git tag
```

## Publish

`prepublishOnly` / `prepack` already run typecheck + build; `prepublishOnly` also runs `pack:check`.

```bash
# First public release under the org scope
pnpm publish --access public

# Later releases (access already public)
pnpm publish
```

Dry-run without uploading:

```bash
pnpm pack:check
# or
npm publish --dry-run
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

3. Confirm `node_modules/@persianstudio/tourara` contains only `dist/` + READMEs (no `showcase/`)
4. Tag the release on GitHub (if not done by `pnpm version`)
5. Optionally announce / update the Pages demo if showcase changed

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `402 Payment Required` / forbidden scope | Ensure org membership + 2FA; use `--access public` for scoped packages |
| Wrong files in tarball | Check `files` + `.npmignore`; run `pnpm pack:check` |
| Types resolve to missing paths | Build must use vite-plugin-dts `rollupTypes` (single `dist/index.d.ts`) — do not re-run loose `tsc` emit into `dist/` |
| Consumers miss styles | Styles inject via `TourProvider` / `Tour`; or `import '@persianstudio/tourara/styles.css'` |

## Related docs

- [CONTRIBUTING.md](./CONTRIBUTING.md) — day-to-day development
- [API.md](./API.md) — export map
- [../README.md](../README.md) — end-user install & API
