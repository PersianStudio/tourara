import { useState } from 'react';
import { TourHost, useTour, useTourStore, type TourDirection, type TourStep } from '@persianstudio/tourara';
import { CapabilityGrid } from './demo/CapabilityGrid';
import { ControlledDemo } from './demo/ControlledDemo';
import { CustomUIShowcase } from './demo/CustomUIShowcase';
import { DemoApp } from './demo/DemoApp';
import { RtlDemo } from './demo/RtlDemo';
import { SetupGuide } from './demo/SetupGuide';
import { WhyBuilt } from './demo/WhyBuilt';
import { RTL_TOUR_STEPS } from './demo/rtlTourSteps';
import { CUSTOM_UI_TOUR_STEPS, MAIN_TOUR_STEPS, SETUP_TOUR_STEPS } from './demo/tourSteps';
import { useColorMode } from './theme';

const TOUR_BASE = {
  maskPadding: 6,
  maskRadius: 2,
  corner: 'small' as const,
  tooltipBorderRadius: 1,
  direction: 'ltr' as TourDirection,
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
  const [demoDirection, setDemoDirection] = useState<TourDirection>('ltr');
  const { mode, toggleMode } = useColorMode();

  const startTour = (steps: TourStep[] = MAIN_TOUR_STEPS, direction: TourDirection = 'ltr') => {
    setTourProps({
      steps,
      isOpen: true,
      ...TOUR_BASE,
      direction,
    });
  };

  const startMainTour = () => {
    startTour(MAIN_TOUR_STEPS, 'ltr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startSetupTour = () => {
    document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => startTour(SETUP_TOUR_STEPS, 'ltr'), 350);
  };

  const startCustomUiTour = () => {
    document.getElementById('custom-ui')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => startTour(CUSTOM_UI_TOUR_STEPS, 'ltr'), 350);
  };

  const startRtlTour = () => {
    setDemoDirection('rtl');
    document.getElementById('rtl')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => startTour(RTL_TOUR_STEPS, 'rtl'), 350);
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
          Product tours for React — SVG masks, tip markers, auto-scroll, interactive steps, RTL/LTR, and render slots.
          Defaults stay English and LTR.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" data-tour="start-tour" onClick={startMainTour}>
            {tourRunning ? 'Tour running…' : 'Start full tour'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={toggleMode} aria-label="Toggle color mode">
            {mode === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <a className="btn btn-ghost" href="#why">
            Why we built it
          </a>
          <a className="btn btn-ghost" href="#rtl">
            RTL / LTR
          </a>
          <a className="btn btn-ghost" href="#setup">
            Setup guide
          </a>
          <a className="btn btn-ghost" href="https://github.com/PersianStudio/tourara">
            GitHub
          </a>
        </div>
        <ul className="hero-meta">
          <li>ltr default</li>
          <li>rtl ready</li>
          <li>auto-scroll</li>
          <li>slots</li>
        </ul>
      </header>

      <WhyBuilt />

      <DemoApp onStartTour={startMainTour} tourRunning={tourRunning} />

      <RtlDemo
        direction={demoDirection}
        onDirectionChange={setDemoDirection}
        onStartRtlTour={startRtlTour}
      />

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
        <a href="#rtl">RTL</a>
        <a href="#setup">Setup</a>
        <a href="https://github.com/PersianStudio/tourara/blob/main/README.fa.md">فارسی</a>
        <a href="https://github.com/PersianStudio/tourara">GitHub</a>
      </footer>
    </div>
  );
}
