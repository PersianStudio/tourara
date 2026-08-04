# SEO & discoverability

How tourara stays findable on Google, npm, and GitHub — and how to keep CTR high.

## Surfaces

| Surface | URL | Drivers |
|---------|-----|---------|
| Docs (primary) | `/tourara/docs/` | Title templates, keywords meta, canonical, OG/Twitter, JSON-LD, VitePress sitemap, local search |
| Showcase | `/tourara/showcase/` | Demo SEO head, structured data, crawlable noscript |
| Root redirect | `/tourara/` | Canonical → docs |
| npm | package page | `description`, dense `keywords`, README badges |
| GitHub | repo | About blurb, topics, **social preview = `logo.png`** |

## Keyword strategy

Target queries we optimize for:

- react tour / react product tour / react onboarding  
- walkthrough / guided tour / feature tour  
- spotlight mask / tooltip tour  
- RTL tour / Persian Arabic Hebrew tour  
- intro.js / shepherd / reactour / driver.js / joyride **alternatives**  
- TourProvider / custom tour tooltip / MIT react tour  

Docs home includes a short crawlable blurb with those phrases (honest, not keyword stuffing).

## After every deploy

1. [Rich Results Test](https://search.google.com/test/rich-results) on docs + showcase  
2. OG debuggers with `logo.png`  
3. Search Console → property → sitemap `https://persianstudio.github.io/tourara/sitemap.xml`  
4. Confirm logo renders in the docs header  

## GitHub manual settings

- **Website:** `https://persianstudio.github.io/tourara/docs/`  
- **Social preview:** upload repo-root `logo.png`  
- **Topics:** `react`, `typescript`, `onboarding`, `product-tour`, `walkthrough`, `spotlight`, `rtl`, `tooltip`, `open-source`, `persian-studio`  

## CTR principles

1. Lead with the problem (“React product tours / onboarding”) then the brand  
2. Proof: live showcase, MIT, React-only peers, RTL  
3. Name alternatives only as searchable context  
4. Keep badges and version current after npm publish  
