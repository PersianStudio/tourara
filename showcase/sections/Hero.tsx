/**
 * First-viewport hero — brand-first with SEO-friendly supporting copy.
 */
export type HeroProps = {
  tourRunning: boolean;
  onStartMainTour: () => void;
  mode: 'dark' | 'light';
  onToggleMode: () => void;
};

export function Hero({ tourRunning, onStartMainTour, mode, onToggleMode }: HeroProps) {
  return (
    <header className="hero" role="banner">
      <div className="hero-visual">
        <div className="float-mark" aria-hidden data-tour="hero-mark" />
        <div className="hero-ring" aria-hidden />
      </div>
      <p className="hero-kicker">Persian Studio · open-source React onboarding</p>
      <h1 className="brand">
        tourara
        <span className="brand-sub">React product tours</span>
      </h1>
      <p className="hero-lead">
        Build product tours and user walkthroughs in React — SVG spotlight masks, tip markers, smart
        tooltip placement, RTL/LTR, keyboard navigation, and custom UI slots. MIT licensed. Peers:
        React only.
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
        <a className="btn btn-ghost" href="https://github.com/PersianStudio/tourara" rel="noopener noreferrer">
          GitHub
        </a>
        <a
          className="btn btn-ghost"
          href="https://www.npmjs.com/package/@persianstudio/tourara"
          rel="noopener noreferrer"
        >
          npm
        </a>
      </div>
      <ul className="hero-meta">
        <li>react tour</li>
        <li>rtl ready</li>
        <li>spotlight mask</li>
        <li>zero ui peers</li>
      </ul>
    </header>
  );
}
