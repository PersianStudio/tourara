export function CustomUIShowcase() {
  return (
    <section className="section" id="custom-ui">
      <div className="section-head">
        <h2>Custom UI showcase</h2>
        <p>
          tourara stays out of your design system. Use <code>customTooltipRenderer</code>,{' '}
          <code>customFooterRenderer</code>, and <code>renderMask</code> to match any product chrome — this panel is a
          stand-in for a branded ops console.
        </p>
      </div>

      <div className="custom-ui-shell" data-tour="custom-ui-shell">
        <div className="custom-ui-bar">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>
              Skinning
            </p>
            <strong data-tour="custom-ui-title">Aurora Console</strong>
          </div>
          <button type="button" className="btn btn-yellow btn-compact" data-tour="custom-ui-action">
            Apply skin
          </button>
        </div>
        <div className="custom-ui-grid">
          <div className="custom-ui-pane">
            <p className="eyebrow">Slots</p>
            <h3>Bring your chrome</h3>
            <p>Replace the default MUI tooltip while keeping mask math, keyboard nav, and step logic.</p>
            <div className="custom-ui-list">
              <div className="custom-ui-item" data-tour="custom-ui-slot-tooltip">
                <span>customTooltipRenderer</span>
                <strong>full</strong>
              </div>
              <div className="custom-ui-item" data-tour="custom-ui-slot-footer">
                <span>customFooterRenderer</span>
                <strong>partial</strong>
              </div>
              <div className="custom-ui-item" data-tour="custom-ui-slot-mask">
                <span>renderMask</span>
                <strong>overlay</strong>
              </div>
            </div>
          </div>
          <div className="custom-ui-pane">
            <p className="eyebrow">Theme tokens</p>
            <h3>High contrast</h3>
            <p>Yellow signal / blue action — designed to prove tips & masks remain readable on dark UIs.</p>
            <div className="custom-kpi">
              <div data-tour="custom-ui-kpi-a">
                <strong>12</strong>
                <span>slot APIs</span>
              </div>
              <div data-tour="custom-ui-kpi-b">
                <strong>0</strong>
                <span>ICE deps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
