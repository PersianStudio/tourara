# Docs

User and maintainer documentation for **tourara**.

## Hosted site

After GitHub Pages deploy:

**https://persianstudio.github.io/tourara/docs/**

Local:

```bash
pnpm docs:dev
pnpm docs:build
```

## Source map

| Path | Content |
|------|---------|
| `docs/guide/` | End-user guides (setup, placement, RTL, slots, …) |
| `docs/api/` | Export map, options, helpers |
| `docs/internals/` | Architecture, contributing, npm publish, Pages, SEO |
| `docs/.vitepress/` | Site config |

Legacy flat files in this folder (`API.md`, …) redirect maintainers to the VitePress pages above.

## Related

- Live demo: https://persianstudio.github.io/tourara/  
- npm: https://www.npmjs.com/package/@persianstudio/tourara  
- Root [README.md](../README.md)  
