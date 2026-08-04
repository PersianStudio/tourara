import { Tour } from '@persianstudio/tourara';
import { useState } from 'react';
import { CONTROLLED_STEPS } from './tourSteps';

export function ControlledDemo() {
  const [open, setOpen] = useState(false);

  return (
    <section className="section controlled-section">
      <div className="section-head">
        <h2>Controlled mode</h2>
        <p>
          Same engine without the Zustand store — pass <code>isOpen</code> and <code>onClose</code> to{' '}
          <code>{'<Tour />'}</code>.
        </p>
      </div>

      <div className="controlled-shell">
        <button type="button" className="btn btn-primary btn-compact" onClick={() => setOpen(true)}>
          Open controlled tour
        </button>
        <div className="controlled-targets">
          <div className="panel" data-tour="controlled-a">
            <h3>Target A</h3>
            <p>First step in the controlled flow.</p>
          </div>
          <div className="panel" data-tour="controlled-b">
            <h3>Target B</h3>
            <p>Second step — then Done closes via onClose.</p>
          </div>
        </div>
      </div>

      <Tour
        steps={CONTROLLED_STEPS}
        isOpen={open}
        onClose={() => setOpen(false)}
        maskPadding={8}
        maskRadius={10}
        corner="small"
      />
    </section>
  );
}
