import { TourHost, useTour, useTourStore } from '@persianstudio/tourara';
import { CapabilityGrid } from './demo/CapabilityGrid';
import { ControlledDemo } from './demo/ControlledDemo';
import { CustomUIShowcase } from './demo/CustomUIShowcase';
import { DemoApp } from './demo/DemoApp';
import { SetupGuide } from './demo/SetupGuide';
import { WhyBuilt } from './demo/WhyBuilt';
import { CUSTOM_UI_TOUR_STEPS, MAIN_TOUR_STEPS, SETUP_TOUR_STEPS } from './demo/tourSteps';

const TOUR_BASE = {
  maskPadding: 6,
  maskRadius: 2,
  corner: 'small' as const,
  tooltipBorderRadius: 1,
};

function TourBootstrap() {
  useTour({
    tourOptions: {
      steps: MAIN_TOUR_STEPS,
      isOpen: false,
      ...TOUR_BASE,
    },
    openImmediately: true,
  });

  return null;
}

export function App() {
  const { setTourProps, tourProps } = useTourStore();
  const tourRunning = Boolean(tourProps.isOpen);

  const startTour = (steps = MAIN_TOUR_STEPS) => {
    setTourProps({
      steps,
      isOpen: true,
      ...TOUR_BASE,
    });
  };

  const startMainTour = () => {
    startTour(MAIN_TOUR_STEPS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startSetupTour = () => {
    document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => startTour(SETUP_TOUR_STEPS), 350);
  };

  const startCustomUiTour = () => {
    document.getElementById('custom-ui')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => startTour(CUSTOM_UI_TOUR_STEPS), 350);
  };

  return (
    <div className="page">
      <TourHost />
      <TourBootstrap />

      <header className="hero">
        <div className="hero-visual">
          <div className="float-mark" aria-hidden data-tour="hero-mark" />
          <div className="hero-ring" aria-hidden />
        </div>
        <p className="hero-kicker">Persian Studio · docs + playground</p>
        <h1 className="brand">tourara</h1>
        <p className="hero-lead">
          Product tours for React — SVG masks, tip markers, auto-scroll, interactive steps, and render slots. High
          contrast. Low chrome. Built to document itself.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" data-tour="start-tour" onClick={startMainTour}>
            {tourRunning ? 'Tour running…' : 'Start full tour'}
          </button>
          <a className="btn btn-ghost" href="#why">
            Why we built it
          </a>
          <a className="btn btn-ghost" href="#setup">
            Setup guide
          </a>
          <a className="btn btn-ghost" href="https://github.com/PersianStudio/tourara">
            GitHub
          </a>
        </div>
        <ul className="hero-meta">
          <li>auto-scroll</li>
          <li>Esc · ← →</li>
          <li>MUI peer</li>
          <li>slots</li>
        </ul>
      </header>

      <WhyBuilt />

      <DemoApp onStartTour={startMainTour} tourRunning={tourRunning} />

      <CapabilityGrid />

      <SetupGuide onStartSetupTour={startSetupTour} />

      <CustomUIShowcase />
      <div style={{ marginTop: '0.75rem' }}>
        <button type="button" className="btn btn-yellow btn-compact" onClick={startCustomUiTour}>
          Tour custom UI
        </button>
      </div>

      <ControlledDemo />

      <section className="section scroll-section">
        <div className="section-head">
          <h2>Scroll & deep content</h2>
          <p>
            When a step activates, tourara auto-scrolls the target into view (<code>block: &apos;center&apos;</code>).
            Disable with <code>disableAutoScroll</code>.
          </p>
        </div>
        <article className="panel panel-wide" data-tour="scroll-card">
          <p className="eyebrow">Below the fold</p>
          <h3>Auto-scroll to target</h3>
          <p>
            Body scroll stays unlocked so <code>scrollIntoView</code> works while the mask handles interaction. The
            viewport follows each step.
          </p>
        </article>
      </section>

      <footer className="footer">
        <span>Persian Studio · MIT</span>
        <a href="#why">Why</a>
        <a href="#setup">Setup</a>
        <a href="#custom-ui">Custom UI</a>
        <a href="https://github.com/PersianStudio/tourara">GitHub</a>
      </footer>
    </div>
  );
}
