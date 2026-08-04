export function WhyBuilt() {
  return (
    <section className="section why-section" id="why" aria-labelledby="why-heading">
      <div className="why-frame">
        <p className="why-label">Why tourara exists</p>
        <h2 id="why-heading">Built because nothing else was enough</h2>
        <div className="why-body">
          <p>
            We needed an open-source touring system that was <strong>fully customizable</strong> — UI, actions, and
            animations — without fighting the library to ship product onboarding.
          </p>
          <p>
            After searching the ecosystem, we could not find a tour component that met every requirement with complete
            control over chrome, step behavior, and motion. So we built the engine ourselves, used it in production, and
            are publishing it so other developers can do the same.
          </p>
        </div>
        <ul className="why-points">
          <li>
            <span>01</span>
            <div>
              <strong>Custom UI</strong>
              <p>Slots for tooltip, footer, and mask — keep your brand, not a fixed skin.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Custom actions</strong>
              <p>Interactive next/prev, click-to-advance, and DOM helpers for real app flows.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Custom motion</strong>
              <p>Placement, auto-scroll, and transitions you can tune — not a black box.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
