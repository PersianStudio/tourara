# GitHub Pages hosting

Tourara publishes **two** surfaces from one workflow:

| URL | Content |
|-----|---------|
| https://persianstudio.github.io/tourara/ | Interactive showcase (`showcase/`) |
| https://persianstudio.github.io/tourara/docs/ | This documentation site (`docs/` via VitePress) |

## How deploy works

Workflow: `.github/workflows/pages.yml`

1. `pnpm build` — library  
2. `pnpm build:showcase` — Vite app with `base: /tourara/` → `showcase-dist/`  
3. `pnpm docs:build` — VitePress with `base: /tourara/docs/` → `docs-dist/`  
4. Copy `docs-dist/**` into `showcase-dist/docs/`  
5. Upload `showcase-dist` as the Pages artifact  
6. Deploy with `actions/deploy-pages`

```text
showcase-dist/          ← Pages root for /tourara/
  index.html            ← demo
  assets/…
  docs/                 ← merged VitePress output
    index.html
    guide/…
    api/…
```

## Local preview

```bash
pnpm docs:dev          # http://localhost:5174/tourara/docs/ (port may vary)
pnpm build:showcase && pnpm docs:build
# optional: serve showcase-dist with a static server to verify merge layout
```

## Repo settings (manual, once)

In GitHub → **Settings → Pages**:

1. Source: **GitHub Actions**  
2. Ensure the `pages` environment exists (created on first workflow run)  
3. About → Website: `https://persianstudio.github.io/tourara/`  

## Base paths

| App | Vite / VitePress `base` |
|-----|-------------------------|
| Showcase | `/tourara/` |
| Docs | `/tourara/docs/` |

If the repo is renamed or moved off `PersianStudio/tourara`, update both bases and the workflow merge path.

## Sitemap & robots

`showcase/public/sitemap.xml` lists the demo and docs URLs. `robots.txt` points crawlers at that sitemap. Update both when adding top-level doc sections.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Docs 404 at `/tourara/docs/` | Confirm workflow copies into `showcase-dist/docs` and `base` is `/tourara/docs/` |
| Broken asset URLs in docs | VitePress `base` must match the Pages subpath |
| Showcase OK, docs stale | Check Actions log for `docs:build` failures |
| Favicon missing on docs | Config points at `/tourara/favicon.svg` from the showcase public folder |
