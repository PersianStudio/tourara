interface DemoAppProps {
  onStartTour: () => void;
}

export function DemoApp({ onStartTour }: DemoAppProps) {
  return (
    <div className="demo-shell">
      <div className="demo-top">
        <div className="demo-logo" data-tour="nav-brand">
          Northwind Ops
        </div>
        <div className="demo-nav" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" onClick={onStartTour}>
            Tips
          </button>
          <button type="button" data-tour="profile">
            Ada L.
          </button>
        </div>
      </div>
      <div className="demo-body">
        <aside className="demo-side">
          <button type="button">Overview</button>
          <button type="button" data-tour="sidebar-reports">
            Reports
          </button>
          <button type="button">Team</button>
          <button type="button">Settings</button>
        </aside>
        <main className="demo-main">
          <div className="panel" data-tour="stats-panel">
            <h3>Weekly pulse</h3>
            <p>12 tours completed · 3 drafts · 98% step visibility</p>
          </div>
          <div className="panel">
            <h3>Pipeline</h3>
            <p>Highlight real UI, not mock overlays. Tourara portals into your scroll root and tracks moving targets.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
