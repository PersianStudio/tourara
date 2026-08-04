import { useEffect, useRef, useState } from 'react';

interface DemoAppProps {
  onStartTour: () => void;
  tourRunning: boolean;
}

export function DemoApp({ onStartTour, tourRunning }: DemoAppProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  return (
    <div className="demo-shell">
      <div className="demo-top">
        <div className="demo-logo" data-tour="nav-brand">
          <span className="demo-logo-mark" />
          Northwind Ops
        </div>
        <div className="demo-search" data-tour="nav-search">
          <span className="demo-search-icon" aria-hidden>
            ⌕
          </span>
          <input aria-label="Search" placeholder="Search workspaces, reports…" readOnly />
        </div>
        <div className="demo-top-actions">
          <button type="button" className="demo-ghost" onClick={onStartTour} disabled={tourRunning}>
            {tourRunning ? 'Tour live' : 'Tips'}
          </button>
          <div className="demo-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="demo-icon-btn"
              data-tour="menu-trigger"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ⋮
            </button>
            {menuOpen && (
              <>
                <button
                  type="button"
                  className="demo-menu-backdrop"
                  data-tour="menu-backdrop"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="demo-menu" role="menu">
                  <button type="button" role="menuitem" data-tour="menu-item-export">
                    Export CSV
                  </button>
                  <button type="button" role="menuitem">
                    Duplicate view
                  </button>
                  <button type="button" role="menuitem">
                    Share link
                  </button>
                </div>
              </>
            )}
          </div>
          <button type="button" className="demo-avatar" data-tour="profile">
            Ada L.
          </button>
        </div>
      </div>

      <div className="demo-body">
        <aside className="demo-side">
          <p className="demo-side-label">Workspace</p>
          <button type="button">Overview</button>
          <button type="button" data-tour="sidebar-reports" className="is-active">
            Reports
          </button>
          <button type="button">Team</button>
          <button type="button">Settings</button>
          <div className="demo-side-foot">
            <div className="moving-orb" data-tour="moving-orb" title="Animated target" />
            <span>Live signal</span>
          </div>
        </aside>

        <main className="demo-main">
          <div className="demo-grid">
            <article className="panel panel-featured" data-tour="stats-pulse">
              <p className="eyebrow">Weekly pulse</p>
              <h3>12 tours · 3 drafts</h3>
              <p>98% step visibility across the last cohort. Mask padding and radius keep focus readable.</p>
              <div className="stat-row">
                <div>
                  <strong>4.2s</strong>
                  <span>avg step</span>
                </div>
                <div>
                  <strong>91%</strong>
                  <span>completion</span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>hard blocks</span>
                </div>
              </div>
            </article>

            <article className="panel">
              <p className="eyebrow">Actions</p>
              <h3>Primary CTA</h3>
              <p>Demonstrate nextOnTargetClick — the tour advances when this is pressed.</p>
              <button type="button" className="btn btn-primary btn-compact" data-tour="cta-primary">
                Launch report
              </button>
            </article>

            <article className="panel" data-tour="orient-north">
              <p className="eyebrow">Placement</p>
              <h3>Orientation prefs</h3>
              <p>Bias the tooltip south / southeast of this card with decorative corners on diagonals.</p>
              <div className="chip-row">
                <span className="chip">south</span>
                <span className="chip">south-east</span>
                <span className="chip">corner</span>
              </div>
            </article>

            <article className="panel" data-tour="custom-footer">
              <p className="eyebrow">Slots</p>
              <h3>Custom footer</h3>
              <p>Swap default Skip / chevrons for branded Back / Continue controls.</p>
            </article>

            <article className="panel panel-accent" data-tour="custom-tooltip">
              <p className="eyebrow">Slots</p>
              <h3>Custom tooltip</h3>
              <p>Replace the entire tooltip chrome while keeping mask + navigation engine.</p>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
