import { defineConfig } from 'vitepress';

const SITE = 'https://persianstudio.github.io/tourara';
const DOCS = `${SITE}/docs`;
const SHOWCASE = `${SITE}/showcase/`;

const KEYWORDS = [
  'tourara',
  'react tour',
  'react product tour',
  'react onboarding',
  'user onboarding react',
  'feature walkthrough',
  'guided tour react',
  'spotlight mask',
  'react spotlight tour',
  'tooltip tour',
  'tip markers',
  'RTL tour',
  'LTR RTL react',
  'persian react tour',
  'arabic hebrew tour',
  'intro.js alternative',
  'shepherd.js alternative',
  'reactour alternative',
  'driver.js alternative',
  'react-joyride alternative',
  'custom tour tooltip',
  'TourProvider',
  'product tour library',
  'open source react tour',
  'MIT react tour',
  'Persian Studio',
].join(', ');

/**
 * Hosted at https://persianstudio.github.io/tourara/docs/
 * Showcase: https://persianstudio.github.io/tourara/showcase/
 */
export default defineConfig({
  title: 'tourara',
  titleTemplate: ':title · React product tours',
  description:
    'tourara is an open-source React product-tour & onboarding library: SVG spotlight masks, smart tooltip placement, tip markers, RTL/LTR, keyboard nav, and custom UI slots. MIT. React-only peers — no MUI.',
  lang: 'en-US',
  base: '/tourara/docs/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  outDir: '../docs-dist',
  cacheDir: '../node_modules/.vitepress-cache',

  sitemap: {
    hostname: DOCS,
  },

  head: [
    ['link', { rel: 'icon', href: '/tourara/docs/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/tourara/docs/logo.png', type: 'image/png', sizes: '512x512' }],
    ['link', { rel: 'apple-touch-icon', href: '/tourara/docs/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/tourara/docs/site.webmanifest' }],
    ['link', { rel: 'canonical', href: `${DOCS}/` }],
    ['link', { rel: 'alternate', hreflang: 'en', href: `${DOCS}/` }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: `${DOCS}/` }],
    ['meta', { name: 'theme-color', content: '#0b1220' }],
    ['meta', { name: 'color-scheme', content: 'dark light' }],
    ['meta', { name: 'author', content: 'Persian Studio' }],
    ['meta', { name: 'keywords', content: KEYWORDS }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'application-name', content: 'tourara' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'tourara' }],

    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'tourara' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:title', content: 'tourara docs — React product tours & onboarding' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Docs for @persianstudio/tourara: install, placement, spotlight mask, tip markers, RTL, render slots, API reference. MIT · React-only peers.',
      },
    ],
    ['meta', { property: 'og:url', content: `${DOCS}/` }],
    ['meta', { property: 'og:image', content: `${DOCS}/logo.png` }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1024' }],
    ['meta', { property: 'og:image:height', content: '1024' }],
    ['meta', { property: 'og:image:alt', content: 'tourara logo — React product tour toolkit by Persian Studio' }],

    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'tourara — React product tour documentation' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'Open-source React tours: SVG spotlight, smart placement, RTL, custom slots. Full docs + live showcase.',
      },
    ],
    ['meta', { name: 'twitter:image', content: `${DOCS}/logo.png` }],
    ['meta', { name: 'twitter:image:alt', content: 'tourara logo' }],

    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${DOCS}/#website`,
            url: `${DOCS}/`,
            name: 'tourara documentation',
            description:
              'Documentation for tourara — React product-tour & onboarding library with spotlight masks, tips, and RTL.',
            publisher: { '@id': `${SITE}/#organization` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'SoftwareApplication',
            '@id': `${SITE}/#software`,
            name: 'tourara',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            softwareVersion: '0.1.0',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            license: 'https://opensource.org/licenses/MIT',
            url: 'https://www.npmjs.com/package/@persianstudio/tourara',
            downloadUrl: 'https://www.npmjs.com/package/@persianstudio/tourara',
            codeRepository: 'https://github.com/PersianStudio/tourara',
            description:
              'React product tour & onboarding toolkit: SVG spotlight, smart placement, tip markers, RTL/LTR, custom UI slots. React-only peers.',
            author: { '@id': `${SITE}/#organization` },
            keywords: KEYWORDS,
          },
          {
            '@type': 'Organization',
            '@id': `${SITE}/#organization`,
            name: 'Persian Studio',
            url: 'https://github.com/PersianStudio',
            logo: `${DOCS}/logo.png`,
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'tourara',
                item: `${DOCS}/`,
              },
            ],
          },
        ],
      }),
    ],
  ],

  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
    const url = path ? `${DOCS}/${path}` : `${DOCS}/`;
    const title = pageData.title || 'tourara';
    const description =
      pageData.description ||
      'tourara React product-tour documentation — spotlight mask, placement, RTL, slots, and API.';

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url.endsWith('/') ? url : `${url}` }],
      ['meta', { property: 'og:title', content: `${title} · tourara` }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'keywords', content: KEYWORDS }],
    );
  },

  themeConfig: {
    logo: { src: '/logo.svg', alt: 'tourara' },
    siteTitle: 'tourara',
    outline: [2, 3],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
          },
        },
      },
    },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/overview' },
      { text: 'Internals', link: '/internals/architecture' },
      { text: 'Showcase', link: SHOWCASE },
      { text: 'npm', link: 'https://www.npmjs.com/package/@persianstudio/tourara' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/PersianStudio/tourara' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@persianstudio/tourara' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Start here',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Host vs controlled', link: '/guide/host-vs-controlled' },
            { text: 'Steps & selectors', link: '/guide/steps' },
          ],
        },
        {
          text: 'Core features',
          items: [
            { text: 'Placement & orientations', link: '/guide/placement' },
            { text: 'Mask & spotlight', link: '/guide/mask' },
            { text: 'Tooltip & caret', link: '/guide/tooltip-caret' },
            { text: 'Tip markers', link: '/guide/tip-markers' },
            { text: 'RTL & LTR', link: '/guide/rtl' },
          ],
        },
        {
          text: 'Customization',
          items: [
            { text: 'Render slots', link: '/guide/slots' },
            { text: 'Interactive flows', link: '/guide/interactive' },
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Responsive & mobile', link: '/guide/responsive' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API reference',
          items: [
            { text: 'Overview & exports', link: '/api/overview' },
            { text: 'Components & hooks', link: '/api/components' },
            { text: 'Options & steps', link: '/api/options' },
            { text: 'DOM helpers', link: '/api/helpers' },
          ],
        },
      ],
      '/internals/': [
        {
          text: 'Maintainers',
          items: [
            { text: 'Architecture', link: '/internals/architecture' },
            { text: 'Contributing', link: '/internals/contributing' },
            { text: 'Publishing to npm', link: '/internals/publishing' },
            { text: 'GitHub Pages', link: '/internals/github-pages' },
            { text: 'SEO & discoverability', link: '/internals/seo' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/PersianStudio/tourara/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License · <a href="https://persianstudio.github.io/tourara/showcase/">Live showcase</a>',
      copyright: 'Copyright © Persian Studio',
    },
  },
});
