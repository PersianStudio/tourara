import { defineConfig } from 'vitepress';

/**
 * Hosted at https://persianstudio.github.io/tourara/docs/
 * Showcase demo remains at https://persianstudio.github.io/tourara/
 */
export default defineConfig({
  title: 'tourara',
  description:
    'React product-tour & onboarding library — SVG spotlight, smart placement, tip markers, RTL, custom slots. MIT. React-only peers.',
  lang: 'en-US',
  base: '/tourara/docs/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  outDir: '../docs-dist',
  cacheDir: '../node_modules/.vitepress-cache',

  head: [
    ['link', { rel: 'icon', href: '/tourara/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#0b1220' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'tourara docs' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Full documentation for @persianstudio/tourara — setup, API, placement, RTL, slots, and GitHub Pages.',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://persianstudio.github.io/tourara/docs/' }],
    ['meta', { property: 'og:image', content: 'https://persianstudio.github.io/tourara/og-image.jpg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: { src: '/tourara/favicon.svg', alt: 'tourara' },
    siteTitle: 'tourara',
    outline: [2, 3],
    search: { provider: 'local' },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/overview' },
      { text: 'Internals', link: '/internals/architecture' },
      { text: 'Live demo', link: 'https://persianstudio.github.io/tourara/' },
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
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Persian Studio',
    },
  },
});
