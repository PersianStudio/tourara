import { TourHost, useTour, useTourStore } from '@persianstudio/tourara';
import { CapabilityGrid } from './demo/CapabilityGrid';
import { ControlledDemo } from './demo/ControlledDemo';
import { DemoApp } from './demo/DemoApp';
import { MAIN_TOUR_STEPS } from './demo/tourSteps';

function TourBootstrap() {
  useTour({
    tourOptions: {
      steps: MAIN_TOUR_STEPS,
      isOpen: false,
      maskPadding: 8,
      maskRadius: 10,
      corner: 'small',
      disableCloseOnClick: false,
    },
    openImmediately: true,
  });

  return null;
}

export function App() {
  const { setTourProps, tourProps } = useTourStore();
  const tourRunning = Boolean(tourProps.isOpen);

  const startTour = () => {
    setTourProps({
      steps: MAIN_TOUR_STEPS,
      isOpen: true,
      maskPadding: 8,
      maskRadius: 10,
      corner: 'small',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <p className="hero-kicker">Persian Studio · open source</p>
        <h1 className="brand">tourara</h1>
        <p className="hero-lead">
          Product tours for React — masks, tip markers, smart placement, interactive steps, and render slots. Built to
          ship onboarding without fighting the DOM.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" data-tour="start-tour" onClick={startTour}>
            {tourRunning ? 'Tour running…' : 'Start full tour'}
          </button>
          <a className="btn btn-ghost" href="https://github.com/PersianStudio/tourara">
            View on GitHub
          </a>
        </div>
        <ul className="hero-meta">
          <li>Esc · ← →</li>
          <li>MUI peer</li>
          <li>TourHost or controlled</li>
        </ul>
      </header>

      <DemoApp onStartTour={startTour} tourRunning={tourRunning} />

      <CapabilityGrid />

      <ControlledDemo />

      <section className="section scroll-section">
        <div className="section-head">
          <h2>Scroll & deep content</h2>
          <p>The main tour scrolls this card into view near the end — targets below the fold still work.</p>
        </div>
        <article className="panel panel-wide" data-tour="scroll-card">
          <p className="eyebrow">Below the fold</p>
          <h3>Auto-scroll to target</h3>
          <p>
            When a step activates, tourara scrolls the target into view (smooth by default). Disable with{' '}
            <code>disableAutoScroll</code> or <code>disableSmoothScroll</code> when you manage scroll yourself.
          </p>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Install</h2>
          <p>Peers: React 18+, MUI 5/6, Emotion.</p>
        </div>
        <pre className="code-block">{`pnpm add @persianstudio/tourara @mui/material @emotion/react @emotion/styled`}</pre>
      </section>

      <footer className="footer">
        <span>Persian Studio · MIT</span>
        <a href="https://github.com/PersianStudio/tourara">GitHub</a>
        <a href="https://www.npmjs.com/package/@persianstudio/tourara">npm</a>
      </footer>
    </div>
  );
}
