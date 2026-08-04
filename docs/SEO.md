# SEO & discoverability

How tourara is set up to be findable on **Google**, **npm**, and **GitHub**, and how to keep scores high.

## Surfaces

| Surface | What drives ranking / CTR |
|---------|---------------------------|
| GitHub Pages demo | Title, meta description, OG/Twitter cards, JSON-LD, sitemap, robots, semantic HTML |
| npm package | `description`, `keywords`, README badges, weekly downloads after publish |
| GitHub repo | About blurb, topics, social preview image, star/README quality |

## Demo site (Pages)

Source of truth: `showcase/index.html` + `showcase/public/`.

Includes:

- Unique `<title>` and meta `description` / `keywords`
- Canonical + `hreflang` (en / fa docs)
- Open Graph + Twitter large image (`og-image.jpg`)
- JSON-LD (`WebSite`, `SoftwareApplication`, `Organization`, `BreadcrumbList`)
- `robots.txt` + `sitemap.xml`
- `site.webmanifest`, favicon, apple-touch-icon
- Skip link, `<main id="main">`, keyword-aware footer anchors
- Noscript fallback with install + links (crawlable text)

After deploy, verify:

1. [Rich Results Test](https://search.google.com/test/rich-results) on `https://persianstudio.github.io/tourara/`
2. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) / [Twitter Card Validator](https://cards-dev.twitter.com/validator) for OG image
3. Google Search Console → add property → submit sitemap: `https://persianstudio.github.io/tourara/sitemap.xml`

## npm

`package.json` keywords target common queries: react tour, onboarding, walkthrough, spotlight, RTL, and competitor names people search when evaluating alternatives (intro.js, shepherd, reactour, driver.js, joyride).

Keep description under ~150 chars, keyword-dense, honest.

## GitHub repo settings (manual)

In the repo **About** panel set:

- **Description:** `React product tours — spotlight mask, tips, RTL, custom slots. MIT. React-only peers.`
- **Website:** `https://persianstudio.github.io/tourara/`
- **Topics:** `react`, `typescript`, `onboarding`, `product-tour`, `walkthrough`, `spotlight`, `rtl`, `tooltip`, `open-source`, `persian-studio`

Social preview: upload `showcase/public/og-image.jpg` (or generate from README) under **Settings → General → Social preview**.

## Content principles (CTR)

1. Lead with the problem (“product tours / onboarding”) then the brand.
2. Show proof: live demo, MIT, React-only peers, RTL.
3. Name alternatives only as searchable context, not FUD.
4. Keep badges current (npm version updates after publish).

## Maintaining scores

- Don’t remove JSON-LD or canonical when editing the showcase shell.
- Keep `og-image.jpg` ≤ ~100KB; 1200×630.
- When renaming routes/anchors, update `sitemap.xml`.
- Prefer descriptive link text (`npm package`, `RTL product tours`) over “click here”.

## Related

- [PUBLISHING.md](./PUBLISHING.md) — npm release
- [CONTRIBUTING.md](./CONTRIBUTING.md) — local workflows
