# Publishing to npm

Guide for releasing `@persianstudio/tourara`.

## Prerequisites

- Publish rights to the `@persianstudio` scope
- `npm login` / `npm whoami`
- Clean release branch; Node 18+ / pnpm 9

## What gets published

Consumers must **never** receive showcase, docs sources, or TypeScript `src/`.

`package.json` → `files` allowlist:

| Path | Why |
|------|-----|
| `dist/index.js` / `.cjs` / `.d.ts` | Bundles + types |
| `dist/tourara.css` | Optional stylesheet entry |
| `LICENSE` | MIT |
| `README.md` / `README.fa.md` | npm page |
| `CHANGELOG.md` | Release notes |

Excluded: `src/`, `showcase/`, `showcase-dist/`, `docs/`, `docs-dist/`, `scripts/`, sourcemaps.

`pnpm pack:check` fails the release if extras land in the tarball.

## Pre-flight

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm build:showcase
pnpm docs:build
pnpm pack:check
```

Checklist:

- [ ] README install paths still accurate  
- [ ] Docs API pages match `src/index.ts`  
- [ ] Showcase + docs build cleanly  
- [ ] Semver bump + CHANGELOG  

## Publish

```bash
pnpm publish --access public   # first scoped release
pnpm publish                   # later
```

Dry-run: `pnpm pack:check` or `npm publish --dry-run`.

## After publish

1. Confirm the npm page  
2. Smoke-test install in a throwaway app  
3. Confirm GitHub Pages redeployed demo + docs  
4. Tag the GitHub release if needed  

## Related

- [Contributing](./contributing)  
- [GitHub Pages](./github-pages)  
- [API overview](../api/overview)  
