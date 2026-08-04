/**
 * Demonstrates auto-scroll to a below-the-fold tour target.
 */
export function ScrollDeepSection() {
  return (
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
  );
}
