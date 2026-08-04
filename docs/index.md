---
layout: home
title: React product tour library
description: tourara docs — open-source React product tours with SVG spotlight masks, smart placement, tip markers, RTL, and custom UI slots. MIT. React-only peers.
head:
  - - meta
    - name: keywords
      content: tourara, react tour, react product tour, onboarding, walkthrough, spotlight mask, RTL tour, intro.js alternative, shepherd alternative, reactour, driver.js, joyride alternative, Persian Studio
hero:
  name: tourara
  text: Product tours for React
  tagline: SVG spotlight · smart placement · tip markers · RTL · custom slots. MIT. React-only peers. Built for onboarding, feature walkthroughs, and guided UX.
  image:
    src: /logo.svg
    alt: tourara logo — spotlight and tooltip mark
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Open live showcase
      link: https://persianstudio.github.io/tourara/showcase/
    - theme: alt
      text: API reference
      link: /api/overview
features:
  - title: Own the chrome
    details: Swap tooltip, footer, and mask with render slots so the tour matches your product — not a fixed skin.
  - title: Placement that stays on screen
    details: Thirteen orientations, viewport clamping, visualViewport-aware geometry, and a caret that rides with the card.
  - title: Real app flows
    details: nextOnTargetClick, customNextFunc, and DOM helpers for menus, async UI, and multi-page host mode.
  - title: RTL without fighting the library
    details: direction mirrors east/west preferences and flips chrome with dir — first-class Persian, Arabic, and Hebrew tours.
---

<script setup>
const showcaseUrl = 'https://persianstudio.github.io/tourara/showcase/'
</script>

## Try the interactive showcase

Click the card below to open the full live demo — product tour walkthrough, RTL sample, controlled mode, and custom UI slots.

<a class="showcase-card" :href="showcaseUrl" rel="noopener">
  <div class="showcase-card__head">
    <img class="showcase-card__logo" src="/logo.svg" width="48" height="48" alt="tourara" />
    <div>
      <div class="showcase-card__badge">Live demo</div>
      <div class="showcase-card__title">tourara showcase</div>
    </div>
  </div>
  <p class="showcase-card__body">
    Run the full tour in your browser. Spotlight masks, tip markers, orientation prefs, custom chrome, and RTL — no install required.
  </p>
  <span class="showcase-card__cta">Open showcase →</span>
</a>

<div class="seo-blurb">

### Why developers search for tourara

If you need a **React product tour**, **onboarding walkthrough**, or **spotlight mask** library without MUI/Zustand lock-in, tourara is built for that. It competes with Intro.js, Shepherd, Reactour, Driver.js, and react-joyride while giving you **custom tooltip slots**, **RTL**, and **precise caret placement**.

Install `@persianstudio/tourara`, mark targets with `data-tour`, and ship guided UX in minutes.

</div>
