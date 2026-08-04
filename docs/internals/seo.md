# SEO & discoverability

How tourara stays findable on Google, npm, and GitHub.

## Surfaces

| Surface | Drivers |
|---------|---------|
| Showcase (Pages) | Title, meta, OG/Twitter, JSON-LD, sitemap, semantic HTML |
| Docs (Pages `/docs`) | VitePress titles/descriptions, internal search, edit links |
| npm | `description`, `keywords`, README badges |
| GitHub repo | About blurb, topics, social preview |

## Demo + docs

Source: `showcase/index.html`, `showcase/public/`, `docs/.vitepress/config.ts`.

After deploy, verify:

1. [Rich Results Test](https://search.google.com/test/rich-results) on the demo URL  
2. OG debuggers for `og-image.jpg`  
3. Search Console → submit `https://persianstudio.github.io/tourara/sitemap.xml`  

## npm keywords

Target queries: react tour, onboarding, walkthrough, spotlight, RTL, and familiar alternative names (intro.js, shepherd, reactour, driver.js, joyride).

## GitHub About (manual)

- **Description:** `React product tours — spotlight mask, tips, RTL, custom slots. MIT. React-only peers.`  
- **Website:** `https://persianstudio.github.io/tourara/`  
- **Topics:** `react`, `typescript`, `onboarding`, `product-tour`, `walkthrough`, `spotlight`, `rtl`, `tooltip`, `open-source`, `persian-studio`  

## Maintaining scores

- Keep JSON-LD / canonical when editing the showcase shell  
- Keep `og-image.jpg` lean (~1200×630)  
- Update `sitemap.xml` when adding major doc routes  
- Prefer descriptive link text over “click here”  
