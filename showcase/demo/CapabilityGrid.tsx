const CAPABILITIES = [
  {
    title: 'Spotlight mask',
    body: 'SVG cutout with padding, radius, close-on-backdrop, and optional disableMask.',
  },
  {
    title: 'Smart placement',
    body: '13 orientations including diagonals; prefers candidates that stay in view.',
  },
  {
    title: 'Tip markers',
    body: 'Inactive steps can show circular tips on other visible targets.',
  },
  {
    title: 'Store or controlled',
    body: 'TourHost + useTour for apps, or <Tour /> with local open state.',
  },
  {
    title: 'Interactive steps',
    body: 'customNextFunc, nextOnTargetClick, conditionalTourAction for menus & async UI.',
  },
  {
    title: 'Render slots',
    body: 'customTooltipRenderer, customFooterRenderer, renderMask — theme without forking.',
  },
  {
    title: 'Moving targets',
    body: 'Poll + re-place when elements animate, resize, or shift in layout.',
  },
  {
    title: 'Keyboard',
    body: 'Esc closes · ArrowLeft / ArrowRight navigate · focus trap around tooltip.',
  },
];

export function CapabilityGrid() {
  return (
    <section className="section">
      <div className="section-head">
        <h2>Capability map</h2>
        <p>Everything the main tour walks through — also useful as a checklist when integrating.</p>
      </div>
      <div className="capability-grid">
        {CAPABILITIES.map((item) => (
          <article key={item.title} className="capability-card">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
