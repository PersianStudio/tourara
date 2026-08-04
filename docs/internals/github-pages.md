# GitHub Pages hosting

Tourara publishes **docs as the primary entry** and the interactive showcase beside it:

| URL | Content |
|-----|---------|
| https://persianstudio.github.io/tourara/ | Redirect → `/tourara/docs/` |
| https://persianstudio.github.io/tourara/docs/ | VitePress documentation (home + guides + API) |
| https://persianstudio.github.io/tourara/showcase/ | Interactive demo app |

> Project Pages always include the repo name (`/tourara/…`). There is no `persianstudio.github.io/docs` path from this repository — use `/tourara/docs/`.

## Deploy pipeline

Workflow: `.github/workflows/pages.yml`

1. `pnpm build` — library  
2. `pnpm build:showcase` — Vite app with `base: /tourara/showcase/` → `showcase-dist/`  
3. `pnpm docs:build` — VitePress with `base: /tourara/docs/` → `docs-dist/`  
4. Assemble `pages-dist/`:
   - `pages-dist/docs/` ← docs  
   - `pages-dist/showcase/` ← demo  
   - `pages-dist/index.html` ← redirect to docs  
   - root `sitemap.xml`, `robots.txt`, `logo.png`  
5. Upload `pages-dist` and deploy  

## Local

```bash
pnpm docs:dev          # docs with base /tourara/docs/
pnpm dev               # showcase with base /tourara/showcase/
pnpm build:pages       # full Pages-shaped tree in pages-dist/
```

## Logo / favicon

| File | Use |
|------|-----|
| `docs/public/logo.svg` / `logo.png` | Docs header + OG |
| `showcase/public/favicon.svg` / `logo.png` | Demo favicon / OG |
| Repo root `logo.png` | Upload as GitHub social preview / optional avatar |

## SEO checklist after deploy

1. Confirm https://persianstudio.github.io/tourara/docs/ loads with logo  
2. Confirm showcase card → https://persianstudio.github.io/tourara/showcase/  
3. Submit sitemap: https://persianstudio.github.io/tourara/sitemap.xml  
4. Rich Results / OG debuggers on docs + showcase URLs  
