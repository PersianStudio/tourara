/**
 * Showcase shell: wires TourHost, hero CTAs, and demo sections.
 * Individual demos live under `./demo/` so this file stays orchestration-only.
 */
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
import { Hero } from './sections/Hero';
import { ScrollDeepSection } from './sections/ScrollDeepSection';
import { useColorMode } from './theme';

/** Shared defaults for context-driven tours started from the showcase. */
const TOUR_BASE = {
  maskPadding: 6,
  maskRadius: 2,
  corner: 'small' as const,
  tooltipBorderRadius: 8,
  direction: 'ltr' as TourDirection,
};

/** Opens the main product tour once when the showcase mounts. */
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

      <Hero tourRunning={tourRunning} onStartMainTour={startMainTour} mode={mode} onToggleMode={toggleMode} />

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

      <ScrollDeepSection />

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
