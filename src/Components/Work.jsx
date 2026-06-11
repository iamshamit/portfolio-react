import React from 'react';
import { PORTFOLIO } from '../data/config';
import {
  AvniPage, NexaraPage, PortfolioPage, RahiPage,
  SpendWisePage, PastaPage, FmhyPage,
} from './HeroCards';

/* ── Project frontpage recreations (Project Hero Cards handoff) ──── */

const GALLERY_UI = {
  'Portfolio':    <PortfolioPage />,
  'SpendWise':    <SpendWisePage />,
  'FMHY Search':  <FmhyPage />,
  'Pasta':        <PastaPage />,
};

const FEATURED_UI = {
  'Avni':   <AvniPage />,
  'Nexara': <NexaraPage />,
  'Rahi':   <RahiPage />,
};

const GRAD = {
  ocean: 'var(--g-ocean)',
  teal: 'var(--g-teal)',
  aurora: 'var(--g-aurora)',
  ember: 'var(--g-ember)',
};

const TERMINALS = {
  Helix: [
    ['c-dim', '$ '], ['', 'helix deploy --env prod\n'],
    ['c-tl', '› '], ['c-dim', 'scheduling 2,418,903 jobs across 64 workers\n'],
    ['c-grn', '✓ '], ['', 'backpressure stable · p99 14ms\n'],
    ['c-grn', '✓ '], ['', 'exactly-once · 0 duplicates\n'],
    ['c-amb', '◷ '], ['c-dim', 'retries 0.02%  ·  drift nominal\n'],
    ['c-tl', '› '], ['', 'orchestrator healthy '], ['cursor-blink', ''],
  ],
  Vela: [
    ['c-dim', '$ '], ['', 'vela ingest ./contracts/*.pdf\n'],
    ['c-tl', '› '], ['c-dim', 'parsed 1,204 pages · 18,402 chunks\n'],
    ['c-grn', '✓ '], ['', 'embedded → pgvector (768d)\n'],
    ['c-dim', '$ '], ['', 'vela ask "indemnity caps?"\n'],
    ['c-amb', '» '], ['', '3 grounded answers · 7 citations\n'],
    ['c-grn', '✓ '], ['', 'confidence 0.94 '], ['cursor-blink', ''],
  ],
};

function Mock({ p }) {
  if (p.mock === 'terminal') {
    const t = TERMINALS[p.name] || [['', 'ready']];
    return (
      <div className="mock terminal">
        <div className="bar">
          <div className="dots"><i /><i /><i /></div>
          <div className="url">{p.name.toLowerCase()} — zsh</div>
        </div>
        <div className="screen">
          <div className="ln">
            {t.map((seg, i) =>
              seg[0] === 'cursor-blink'
                ? <span key={i} className="cursor-blink" />
                : <span key={i} className={seg[0]}>{seg[1]}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mock browser">
      <div className="bar">
        <div className="dots"><i /><i /><i /></div>
        <div className="url">{p.mockUrl || `${p.name.toLowerCase()}.app`}</div>
      </div>
      <div className="screen">
        {FEATURED_UI[p.name] ?? <div className="slot-placeholder">Drop {p.name} screenshot</div>}
      </div>
    </div>
  );
}

function Feat({ p }) {
  return (
    <article className="feat" data-screen-label={`Project ${p.num}`}>
      <a className="feat-vis" data-cursor="view" data-parallax="" href={p.url} target="_blank" rel="noreferrer" style={{ display:'block', textDecoration:'none' }}>
        {!FEATURED_UI[p.name] && <div className="g" style={{ background: GRAD[p.gradient] }} />}
        <Mock p={p} />

        <div className="vis-grain" />

      </a>
      <div className="feat-txt">
        <div className="ft-tag reveal">{p.role}</div>
        <h3 className="reveal">{p.name}</h3>
        <div className="tagline reveal">{p.tagline}</div>
        <p className="desc reveal">{p.desc}</p>
        <div className="stack reveal" data-stagger="">
          {p.stack.map((s, i) => <span key={i} className="chip">{s}</span>)}
        </div>
        <div className="feat-actions reveal">
          <a className="btn-ghost" href={p.url} target="_blank" rel="noreferrer">Live <span>→</span></a>
          {p.repo && p.repo !== "#" && <a className="btn-ghost" href={p.repo} target="_blank" rel="noreferrer">Code</a>}
        </div>
      </div>
    </article>
  );
}

export function Featured() {
  return (
    <section className="featured" id="work">
      <div className="well" style={{ paddingTop: '150px' }}>
        <div className="sec-head">
          <div className="idx"><span className="bar" />02 — Selected Work</div>
          <h2 className="reveal">Things I built that move.</h2>
          <div className="note">{PORTFOLIO.featured.length} featured · {new Date().getFullYear()}</div>
        </div>
      </div>
      {PORTFOLIO.featured.map((p) => <Feat key={p.num} p={p} />)}
    </section>
  );
}

export function Gallery() {
  return (
    <section className="gallery-wrap" id="gallery" data-gallery="">
      <div className="gallery-sticky">
        <div className="gallery-track" data-gallery-track="">
          <div className="gallery-intro">
            <div className="idx">03 — More</div>
            <h2>And a few more.</h2>
            <p>Side projects, experiments, and tools. Drag or scroll →</p>
          </div>
          {PORTFOLIO.gallery.map((p) => (
            <a key={p.num} className="gcard" href={p.url} data-cursor="view">
              <div className="gvis">
                {GALLERY_UI[p.name] ?? <div className="g" style={{ background: GRAD[p.gradient] }} />}
                <div className="vis-grain" />
              </div>
              <div className="gmeta">
                <div>
                  <div className="gt">{p.name}</div>
                  <div className="gstack">{p.stack}</div>
                </div>
                <div className="gtag">{p.tag}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
