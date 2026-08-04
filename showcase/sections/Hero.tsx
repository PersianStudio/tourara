/**
 * First-viewport hero for the showcase — brand, lead, and primary CTAs.
 */
export type HeroProps = {
  tourRunning: boolean;
  onStartMainTour: () => void;
  mode: 'dark' | 'light';
  onToggleMode: () => void;
};

export function Hero({ tourRunning, onStartMainTour, mode, onToggleMode }: HeroProps) {
  return (
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
        <button type="button" className="btn btn-primary" data-tour="start-tour" onClick={onStartMainTour}>
          {tourRunning ? 'Tour running…' : 'Start full tour'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onToggleMode} aria-label="Toggle color mode">
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
  );
}
