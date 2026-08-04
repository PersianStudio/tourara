import { useCallback, useState } from 'react';

const SNIPPETS = [
  {
    id: 'install',
    title: '1. Install',
    blurb: 'Add tourara (React 18+). No MUI / Zustand required — peers are only react and react-dom.',
    language: 'bash',
    filename: 'terminal',
    code: `pnpm add @persianstudio/tourara

# npm
npm install @persianstudio/tourara

# yarn
yarn add @persianstudio/tourara`,
  },
  {
    id: 'anchors',
    title: '2. Mark targets',
    blurb: 'Stable CSS selectors — data-tour attributes work well.',
    language: 'tsx',
    filename: 'App.tsx',
    code: `<nav data-tour="nav">…</nav>
<button data-tour="cta">Save</button>
<aside data-tour="sidebar">…</aside>`,
  },
  {
    id: 'steps',
    title: '3. Define steps',
    blurb: 'Each step needs a selector plus title/content. Options can be global or per-step.',
    language: 'tsx',
    filename: 'tourSteps.ts',
    code: `import { CardinalOrientation, type TourStep } from '@persianstudio/tourara';

export const steps: TourStep[] = [
  {
    selector: '[data-tour="nav"]',
    title: 'Navigation',
    content: 'Primary app navigation lives here.',
    orientationPreferences: [CardinalOrientation.SOUTH],
  },
  {
    selector: '[data-tour="cta"]',
    title: 'Save',
    content: 'Click when you are ready to continue.',
    nextOnTargetClick: true,
    finishBtnText: 'Done',
  },
];`,
  },
  {
    id: 'host',
    title: '4. TourProvider + TourHost',
    blurb: 'Wrap once with TourProvider. Mount TourHost. Register steps, then open the tour.',
    language: 'tsx',
    filename: 'App.tsx',
    code: `import {
  TourProvider,
  TourHost,
  useTour,
  useTourContext,
  type TourStep,
} from '@persianstudio/tourara';
import { steps } from './tourSteps';

function PageTour() {
  useTour({
    tourOptions: { steps, maskPadding: 8, maskRadius: 10 },
    openImmediately: true,
  });

  const { setTourProps } = useTourContext();

  return (
    <button type="button" onClick={() => setTourProps({ isOpen: true })}>
      Start tour
    </button>
  );
}

export function App() {
  return (
    <TourProvider>
      {/* Optional: clear tour when the route changes */}
      <TourHost resetKey={location.pathname} />
      <PageTour />
      <nav data-tour="nav">Home</nav>
      <button data-tour="cta">Save</button>
    </TourProvider>
  );
}`,
  },
  {
    id: 'controlled',
    title: '5. Controlled Tour',
    blurb: 'No shared context — own isOpen / onClose yourself (modals, tests, feature flags).',
    language: 'tsx',
    filename: 'ControlledTour.tsx',
    code: `import { useState } from 'react';
import { Tour, type TourStep } from '@persianstudio/tourara';

const steps: TourStep[] = [
  {
    selector: '[data-tour="hero"]',
    title: 'Welcome',
    content: 'A short walkthrough of this screen.',
  },
];

export function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Start
      </button>
      <div data-tour="hero">Hero</div>
      <Tour
        steps={steps}
        isOpen={open}
        onClose={() => setOpen(false)}
        maskPadding={8}
        maskRadius={8}
      />
    </>
  );
}`,
  },
  {
    id: 'interactive',
    title: '6. Interactive next',
    blurb: 'Open a menu (or wait for DOM) before advancing with conditionalTourAction.',
    language: 'tsx',
    filename: 'interactiveStep.ts',
    code: `import {
  conditionalTourAction,
  type TourLogic,
  type TourStep,
} from '@persianstudio/tourara';

const step: TourStep = {
  selector: '[data-tour="menu-item"]',
  title: 'Export',
  content: 'Nested item inside a menu.',
  customNextFunc: async (logic: TourLogic) => {
    await conditionalTourAction(
      '[data-tour="menu-item"]',
      '[data-tour="menu-trigger"]',
      () => logic.goToStep(logic.stepIndex + 1),
    );
  },
};`,
  },
];

function CodeEditor({
  filename,
  language,
  code,
}: {
  filename: string;
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback for older browsers / insecure contexts
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }, [code]);

  return (
    <div className="code-editor">
      <div className="code-editor-bar">
        <div className="code-editor-dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <span className="code-editor-file">
          {filename}
          <span className="code-editor-lang">{language}</span>
        </span>
        <button type="button" className="code-copy" onClick={onCopy} aria-label="Copy code">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-editor-body">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function SetupGuide({ onStartSetupTour }: { onStartSetupTour: () => void }) {
  return (
    <section className="section setup-section" id="setup" data-tour="setup-section">
      <div className="section-head">
        <h2 data-tour="setup-heading">Setup guidance</h2>
        <p>
          From install to a running tour — copy each snippet into your app. Prefer{' '}
          <code>TourProvider</code> + <code>TourHost</code> for multi-page apps.
          products; use controlled <code>Tour</code> when you already own open state.
        </p>
        <button type="button" className="btn btn-yellow btn-compact" data-tour="setup-tour-btn" onClick={onStartSetupTour}>
          Tour this setup
        </button>
      </div>

      <ol className="setup-checklist" data-tour="setup-checklist">
        <li>Install package (React peers only)</li>
        <li>
          Add <code>data-tour</code> anchors
        </li>
        <li>
          Define <code>TourStep[]</code>
        </li>
        <li>
          Mount <code>TourHost</code> and call <code>setTourProps({'{ isOpen: true }'})</code>
        </li>
      </ol>

      <div className="setup-stack">
        {SNIPPETS.map((snippet) => (
          <article key={snippet.id} className="setup-card" data-tour={`setup-${snippet.id}`}>
            <div className="setup-card-copy">
              <h3>{snippet.title}</h3>
              <p>{snippet.blurb}</p>
            </div>
            <CodeEditor filename={snippet.filename} language={snippet.language} code={snippet.code} />
          </article>
        ))}
      </div>
    </section>
  );
}
