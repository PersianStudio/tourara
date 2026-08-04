import {
  TourHost,
  useTour,
  useTourStore,
  type TourStep,
} from "@persianstudio/tourara";
import { Box, Typography } from "@mui/material";
import { DemoApp } from "./demo/DemoApp";

const steps: TourStep[] = [
  {
    selector: '[data-tour="welcome"]',
    title: "Welcome to tourara",
    content: (
      <Box>
        <Typography variant="body1" color="inherit" sx={{ mb: 1 }}>
          A React product-tour toolkit with smart positioning, SVG masks, and
          tip markers.
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.85 }}>
          Follow the highlighted targets — or click Next to continue.
        </Typography>
      </Box>
    ),
    orientationPreferences: undefined,
    disableMask: true,
    noSkipBtn: true,
    finishBtnText: "Start",
  },
  {
    selector: '[data-tour="nav-brand"]',
    title: "Brand anchor",
    content:
      "Target any element with a selector. This step highlights the product brand in the demo shell.",
    tipOrientationPreferences: undefined,
  },
  {
    selector: '[data-tour="sidebar-reports"]',
    title: "Sidebar item",
    content:
      "Inactive tip markers can appear on other visible steps while you move through the tour.",
  },
  {
    selector: '[data-tour="start-tour"]',
    title: "Kickoff control",
    content:
      "Wire a Start Tour button to `setTourProps({ isOpen: true })` — or open from `useTour`.",
    nextOnTargetClick: true,
  },
  {
    selector: '[data-tour="stats-panel"]',
    title: "Content panel",
    content:
      "Supports custom React content, orientation preferences, and per-step option overrides.",
  },
  {
    selector: '[data-tour="profile"]',
    title: "You are ready",
    content:
      "Install `@persianstudio/tourara`, mount `<TourHost />`, register steps, and ship onboarding.",
    finishBtnText: "Finish",
  },
];

function TourBootstrap() {
  useTour({
    tourOptions: {
      steps,
      isOpen: false,
      maskPadding: 8,
      maskRadius: 8,
      corner: "small",
    },
    openImmediately: true,
  });

  return null;
}

export function App() {
  const { setTourProps, tourProps } = useTourStore();

  const startTour = () => {
    setTourProps({ steps, isOpen: true });
  };

  return (
    <div className="page">
      <TourHost />
      <TourBootstrap />

      <header className="hero">
        <div className="float-mark" aria-hidden data-tour="welcome" />
        <h1 className="brand">tourara</h1>
        <p className="hero-lead">
          Open-source React tours with MUI — masks, tooltips, tip markers, and
          placement that stays in view.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            data-tour="start-tour"
            onClick={startTour}
          >
            {tourProps.isOpen ? "Tour running…" : "Start tour"}
          </button>
          <a
            className="btn btn-ghost"
            href="https://github.com/PersianStudio/tourara"
          >
            GitHub
          </a>
        </div>
      </header>

      <DemoApp onStartTour={startTour} />

      <section className="section">
        <h2>Use it in minutes</h2>
        <p>
          Mount <code>{"<TourHost />"}</code> once, register steps with{" "}
          <code>useTour</code>, and open with{" "}
          <code>setTourProps({"{ isOpen: true }"})</code>. Prefer a fully
          controlled flow? Render <code>{"<Tour />"}</code> directly with{" "}
          <code>isOpen</code> and <code>onClose</code>.
        </p>
      </section>

      <footer className="footer">
        Persian Studio · MIT ·{" "}
        <a href="https://www.npmjs.com/package/@persianstudio/tourara">
          npm (coming soon)
        </a>
      </footer>
    </div>
  );
}
