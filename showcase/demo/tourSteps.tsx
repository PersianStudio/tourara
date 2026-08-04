import {
  CardinalOrientation,
  conditionalTourAction,
  type TourLogic,
  type TourStep,
} from '@persianstudio/tourara';
import { Box, Button, Stack, Typography } from '@mui/material';

export const MAIN_TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="hero-mark"]',
    title: 'Welcome to tourara',
    content: (
      <Box>
        <Typography variant="body1" color="inherit" sx={{ mb: 1.25, lineHeight: 1.55 }}>
          A React product-tour toolkit: SVG masks, smart placement, tip markers, and interactive steps.
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.82 }}>
          This walkthrough hits every major capability. Use Next, Skip, or ← → / Esc.
        </Typography>
      </Box>
    ),
    disableMask: true,
    noSkipBtn: true,
    corner: 'none',
    orientationPreferences: [CardinalOrientation.SOUTH, CardinalOrientation.EAST],
  },
  {
    selector: '[data-tour="nav-brand"]',
    title: 'Selector targeting',
    content: 'Any CSS selector works. Prefer stable anchors like [data-tour="…"] so layout refactors do not break tours.',
    maskPadding: 8,
    maskRadius: 4,
    orientationPreferences: [CardinalOrientation.SOUTH, CardinalOrientation.EAST],
  },
  {
    selector: '[data-tour="nav-search"]',
    title: 'Spotlight mask',
    content: 'The SVG mask dims the page and cuts a padded, rounded hole around the target. Click the dimmed area to close (unless disableCloseOnClick).',
    maskPadding: 8,
    maskRadius: 4,
    orientationPreferences: [CardinalOrientation.SOUTH],
  },
  {
    selector: '[data-tour="sidebar-reports"]',
    title: 'Tip markers',
    content: 'Other steps whose targets are visible can show tip markers while this tooltip stays active — useful for orientation in dense UIs.',
    tipOrientationPreferences: [CardinalOrientation.EAST, CardinalOrientation.SOUTH],
    orientationPreferences: [CardinalOrientation.EAST, CardinalOrientation.NORTH],
  },
  {
    selector: '[data-tour="menu-trigger"]',
    title: 'Interactive next',
    content: 'Next opens the overflow menu first (conditionalTourAction), then advances to the item inside.',
    customNextFunc: async (logic: TourLogic) => {
      await conditionalTourAction(
        '[data-tour="menu-item-export"]',
        '[data-tour="menu-trigger"]',
        () => logic.goToStep(logic.stepIndex + 1),
        () => logic.goToStep(logic.stepIndex + 1),
        80,
        220,
      );
    },
    orientationPreferences: [CardinalOrientation.WEST, CardinalOrientation.SOUTH],
  },
  {
    selector: '[data-tour="menu-item-export"]',
    title: 'Nested targets',
    content: 'After the menu opened, this step highlights a target that was not in the DOM/visible before.',
    orientationPreferences: [CardinalOrientation.WEST, CardinalOrientation.SOUTH],
    customPrevFunc: async (logic: TourLogic) => {
      const backdrop = document.querySelector('[data-tour="menu-backdrop"]') as HTMLElement | null;
      backdrop?.click();
      logic.prev();
    },
  },
  {
    selector: '[data-tour="stats-pulse"]',
    title: 'Custom React content',
    content: (
      <Stack spacing={1.25}>
        <Typography variant="body1" color="inherit">
          Titles and content accept React nodes or render functions with full TourLogic.
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {['Mask', 'Tips', 'Slots'].map((label) => (
            <Box
              key={label}
              sx={{
                px: 1.25,
                py: 0.35,
                borderRadius: 999,
                bgcolor: 'rgba(255,255,255,0.12)',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      </Stack>
    ),
    orientationPreferences: [CardinalOrientation.NORTH, CardinalOrientation.SOUTH],
    maskPadding: 8,
    maskRadius: 12,
  },
  {
    selector: '[data-tour="cta-primary"]',
    title: 'Click the target to continue',
    content: 'nextOnTargetClick advances when the highlighted control is clicked. Try clicking the button.',
    nextOnTargetClick: true,
    orientationPreferences: [CardinalOrientation.NORTH, CardinalOrientation.WEST],
  },
  {
    selector: '[data-tour="moving-orb"]',
    title: 'Moving targets',
    content: 'With movingTarget + updateInterval, the mask and tooltip track elements that animate or resize.',
    movingTarget: true,
    updateInterval: 120,
    maskPadding: 14,
    maskRadius: 40,
    orientationPreferences: [CardinalOrientation.WEST, CardinalOrientation.EAST, CardinalOrientation.SOUTH],
  },
  {
    selector: '[data-tour="orient-north"]',
    title: 'Preferred orientation',
    content: 'orientationPreferences bias placement (here: south of the chip). Diagonals get the decorative corner.',
    orientationPreferences: [CardinalOrientation.SOUTH, CardinalOrientation.SOUTHEAST, CardinalOrientation.SOUTHWEST],
    corner: 'small',
  },
  {
    selector: '[data-tour="custom-footer"]',
    title: 'Custom footer slot',
    content: 'Replace Skip / chevrons with your own footer via customFooterRenderer.',
    noSkipBtn: true,
    customFooterRenderer: (logic) => (
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
        <Button size="small" color="inherit" onClick={() => logic?.close(true)} sx={{ opacity: 0.8 }}>
          Exit
        </Button>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" color="inherit" onClick={() => logic?.prev()} disabled={logic!.stepIndex === 0}>
            Back
          </Button>
          <Button size="small" variant="contained" onClick={() => logic?.next()}>
            Continue
          </Button>
        </Stack>
      </Stack>
    ),
  },
  {
    selector: '[data-tour="custom-tooltip"]',
    title: 'Custom tooltip',
    content: 'Full chrome replacement.',
    customTooltipRenderer: (logic) => (
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: '#0d6e6e',
          color: '#f7fffe',
          boxShadow: '0 24px 48px rgba(13,110,110,0.35)',
          maxWidth: 360,
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.75, letterSpacing: 1.2 }}>
          customTooltipRenderer
        </Typography>
        <Typography variant="h6" sx={{ fontFamily: 'Fraunces, Georgia, serif', mb: 1 }}>
          Bring your own chrome
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, lineHeight: 1.5 }}>
          Swap the default MUI tooltip entirely while keeping mask, placement, and navigation logic.
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" color="inherit" onClick={() => logic?.prev()}>
            Back
          </Button>
          <Button size="small" variant="contained" sx={{ bgcolor: '#fff', color: '#0d6e6e' }} onClick={() => logic?.next()}>
            Next
          </Button>
        </Stack>
      </Box>
    ),
  },
  {
    selector: '[data-tour="scroll-card"]',
    title: 'Scroll into view',
    content: 'Targets outside the viewport are scrolled into view automatically (disable with disableAutoScroll).',
    orientationPreferences: [CardinalOrientation.NORTH, CardinalOrientation.WEST],
    maskPadding: 10,
    maskRadius: 12,
  },
  {
    selector: '[data-tour="profile"]',
    title: 'You are ready',
    content: 'Install @persianstudio/tourara, mount TourHost, register steps, and ship onboarding. Esc closes · ← → navigate.',
    finishBtnText: 'Finish tour',
    skipBtnText: 'Skip',
    orientationPreferences: [CardinalOrientation.WEST, CardinalOrientation.SOUTH],
  },
];

export const CONTROLLED_STEPS: TourStep[] = [
  {
    selector: '[data-tour="controlled-a"]',
    title: 'Controlled Tour',
    content: 'This mini-tour uses <Tour /> with local isOpen / onClose — no store required.',
  },
  {
    selector: '[data-tour="controlled-b"]',
    title: 'Same engine',
    content: 'Ideal for modals, tests, or when you already own open state.',
    finishBtnText: 'Done',
  },
];

export const SETUP_TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="setup-heading"]',
    title: 'Setup, guided by tourara',
    content: 'This whole section is documented with the same engine you ship — meta onboarding.',
    maskPadding: 6,
    maskRadius: 2,
  },
  {
    selector: '[data-tour="setup-checklist"]',
    title: 'Four steps to ship',
    content: 'Install → anchors → steps → TourHost. The checklist is the mental model.',
  },
  {
    selector: '[data-tour="setup-install"]',
    title: 'Copy the install',
    content: 'Each card is a ready-to-copy editor. Hit Copy, paste into your repo.',
    orientationPreferences: [CardinalOrientation.NORTH, CardinalOrientation.SOUTH],
  },
  {
    selector: '[data-tour="setup-host"]',
    title: 'TourHost pattern',
    content: 'Mount once, register steps with useTour, open with setTourProps({ isOpen: true }).',
  },
  {
    selector: '[data-tour="setup-interactive"]',
    title: 'Interactive next',
    content: 'conditionalTourAction opens menus / waits for DOM before advancing — copy this pattern for nested UI.',
    finishBtnText: 'Back to docs',
  },
];

export const CUSTOM_UI_TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="custom-ui-shell"]',
    title: 'Custom product chrome',
    content: 'A dark, high-contrast shell — tourara does not force beige soft UI.',
    maskRadius: 2,
  },
  {
    selector: '[data-tour="custom-ui-slot-tooltip"]',
    title: 'Full tooltip slot',
    content: 'customTooltipRenderer replaces the entire tooltip while keeping placement + mask.',
    customTooltipRenderer: (logic) => (
      <Box
        sx={{
          p: 1.5,
          bgcolor: '#f5c542',
          color: '#0b1220',
          border: '2px solid #1d4ed8',
          maxWidth: 320,
        }}
      >
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          custom skin
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
          Yellow signal tooltip
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.25, opacity: 0.9 }}>
          Prove that slots can look nothing like the default MUI chrome.
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={() => logic?.prev()} sx={{ color: '#0b1220' }}>
            Back
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => logic?.next()}
            sx={{ bgcolor: '#1d4ed8', borderRadius: 0 }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    ),
  },
  {
    selector: '[data-tour="custom-ui-kpi-a"]',
    title: 'Stay on brand',
    content: 'Mask cutouts and tip markers still track precisely on high-contrast panels.',
    finishBtnText: 'Done',
  },
];
