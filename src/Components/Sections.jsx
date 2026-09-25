import React from 'react';
import { PORTFOLIO } from '../data/config';
import { SMMark } from './Field';
import { BlockRenderer, Toc, TocMobile } from './JournalBlocks';
import { Link } from 'react-router-dom';

export function Skills() {
  return (
    <section className="section" id="skills" data-screen-label="Skills">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />Capabilities</div>
          <h2 className="reveal">The toolkit.</h2>
          <div className="note">Frontend → Backend → AI</div>
        </div>
        <div className="skills reveal" data-stagger="">
          {PORTFOLIO.skills.map((s, i) => (
            <div className="skill-col" key={i}>
              <div className="g">{s.group}</div>
              <ul>
                {s.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Timeline() {
  return (
    <section className="section" id="experience" data-screen-label="Experience">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />Path</div>
          <h2 className="reveal">Experience & education.</h2>
          <div className="note">Most recent first</div>
        </div>
        <div className="timeline reveal" data-stagger="">
          {PORTFOLIO.timeline.map((t, i) => (
            <div className="tl-row" key={i} data-cursor="">
              <div className="when">{t.when}</div>
              <div>
                <div className="what">{t.what}</div>
                <div className="where">{t.where}</div>
              </div>
              <div className="note">{t.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const GH_USER = 'iamshamit';
const HEAT_DAYS = 26 * 7;   // last 26 weeks: one column per week
const HEAT = ['rgba(255,255,255,.06)', 'rgba(255,172,46,.28)', 'rgba(255,172,46,.5)', 'rgba(255,172,46,.72)', 'rgba(255,172,46,.95)'];

// Live GitHub data. Config stats stay on screen until (and unless) these resolve.
function useGitHubLive() {
  const [live, setLive] = React.useState({});
  React.useEffect(() => {
    let on = true;
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
    get(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`)
      .then((d) => on && setLive((l) => ({ ...l, days: d.contributions.slice(-HEAT_DAYS), contrib: d.total.lastYear })))
      .catch(() => {});
    get(`https://api.github.com/users/${GH_USER}/repos?per_page=100`)
      .then((rs) => on && setLive((l) => ({ ...l, repos: rs.length, stars: rs.reduce((s, r) => s + r.stargazers_count, 0) })))
      .catch(() => {});
    return () => { on = false; };
  }, []);
  return live;
}

export function GitHub() {
  const g = PORTFOLIO.github;
  const live = useGitHubLive();
  const stat = (s) => (live[s.key] != null ? live[s.key].toLocaleString('en-IN') : s.n);

  return (
    <section className="section github" id="github" data-screen-label="GitHub">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />Open Source</div>
          <div className="note">{g.handle}</div>
        </div>
        <div className="gh-inner">
          <div className="gh-l reveal">
            <h2>Built in the open.</h2>
            <p>{g.blurb}</p>
            <div className="gh-stats" data-stagger="">
              {g.stats.map((s, i) => (
                <div key={i}>
                  <div className="n">{stat(s)}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
            <a className="btn-ghost" href={PORTFOLIO.contact.socials[0].href} target="_blank" rel="noreferrer" style={{ marginTop: '34px' }}>
              View GitHub <span>→</span>
            </a>
          </div>
          <figure className="gh-r reveal">
            {/* real contributions; the grid keeps its footprint while loading so nothing jumps */}
            <div className="contrib" role="img" aria-label={live.contrib != null ? `${live.contrib} GitHub contributions in the last year` : 'GitHub contributions, loading'}>
              {Array.from({ length: HEAT_DAYS }, (_, i) => {
                const d = live.days?.[i];
                return <i key={i} style={{ background: HEAT[d ? d.level : 0] }} title={d ? `${d.count} on ${d.date}` : undefined} />;
              })}
            </div>
            <figcaption className="contrib-cap">
              <span>Last 26 weeks · live from GitHub</span>
              <span className="contrib-key" aria-hidden="true">Less {HEAT.map((c) => <i key={c} style={{ background: c }} />)} More</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const email = PORTFOLIO.contact.email;
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef();
  const openMail = () => { window.location.href = `mailto:${email}`; };
  const copy = () => {
    if (!navigator.clipboard) return openMail();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    }, openMail);
  };
  React.useEffect(() => () => clearTimeout(timer.current), []);

  // "Hold the portal": feed pointer / hovered link / clicks to the WebGL lens (fluid.js reads window.__lens)
  const ref = React.useRef(null);
  React.useEffect(() => {
    const sec = ref.current;
    const L = (window.__lens = { x: innerWidth / 2, y: innerHeight / 2, t: -1e9, el: null, ripple: 0 });
    const move = (e) => {
      const p = e.touches ? e.touches[0] : e;
      L.x = p.clientX; L.y = p.clientY; L.t = performance.now();
    };
    const over = (e) => { if (e.pointerType === 'mouse') L.el = e.target.closest('.email, .socials a'); };
    const leave = () => { L.el = null; };
    const down = () => { L.ripple = performance.now(); };
    sec.addEventListener('pointermove', move);
    sec.addEventListener('touchstart', move, { passive: true });
    sec.addEventListener('touchmove', move, { passive: true });
    sec.addEventListener('pointerover', over);
    sec.addEventListener('pointerleave', leave);
    sec.addEventListener('pointerdown', down);
    return () => {
      sec.removeEventListener('pointermove', move);
      sec.removeEventListener('touchstart', move);
      sec.removeEventListener('touchmove', move);
      sec.removeEventListener('pointerover', over);
      sec.removeEventListener('pointerleave', leave);
      sec.removeEventListener('pointerdown', down);
    };
  }, []);

  return (
    <section className="contact" id="contact" data-screen-label="Contact" ref={ref}>
      <div className="well">
        <div className="eyebrow reveal">Let&apos;s build something</div>
        <h2 className="reveal">
          Say <span className="ital">hello</span>.
        </h2>
        <div className="email-wrap reveal">
          <button className="email" onClick={copy} data-cursor-label="Copy" aria-label={`Copy email address ${email}`}>
            {email}
          </button>
          <span className={`email-toast${copied ? ' show' : ''}`} aria-hidden="true">Copied ✓</span>
          <span className="vh" role="status">{copied ? 'Email address copied' : ''}</span>
        </div>
        <div className="socials reveal" data-stagger="">
          {PORTFOLIO.contact.socials.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer">
              {s.label} <span>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="well">
        <div className="top">
          <div className="brand">{PORTFOLIO.name}</div>
          <div className="meta">
            <div>{PORTFOLIO.role}</div>
            <div>{PORTFOLIO.location}</div>
            <div>Designed in the dark · Built with care</div>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} {PORTFOLIO.fullName}</span>
        </div>
      </div>
    </footer>
  );
}


export function Journal({ onOpen }) {
  if (!PORTFOLIO.journal || !PORTFOLIO.journal.length) return null;
  const shown = PORTFOLIO.journal.slice(0, 4);
  const remaining = PORTFOLIO.journal.length - shown.length;
  return (
    <section className="section" id="journal" data-screen-label="Journal">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />Journal</div>
          <h2 className="reveal">Notes &amp; writing.</h2>
          <div className="note">{PORTFOLIO.journal.length} {PORTFOLIO.journal.length === 1 ? 'entry' : 'entries'}</div>
        </div>
        <div className="journal reveal" data-stagger="">
          {shown.map((post) => (
            <button className="jrow" key={post.num} data-cursor="view"
              onClick={() => onOpen(PORTFOLIO.journal.indexOf(post))}>
              <div className="jnum">{post.num}</div>
              <div className="jmain">
                <div className="jtitle">{post.title}</div>
                <div className="jexcerpt">{post.excerpt}</div>
              </div>
              <div className="jmeta">
                <span className="jtag">{post.tag}</span>
                <span className="jdate">{post.date} · {post.read}</span>
              </div>
              <span className="jarrow">→</span>
            </button>
          ))}
          {remaining > 0 && (
            <div className="j-seeall">
              <span className="j-more">+{remaining} more entr{remaining === 1 ? 'y' : 'ies'}</span>
              <Link to="/journal" className="j-link">All writing <span>→</span></Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Article({ index, onClose, onNav }) {
  const open = index != null;
  const post = open ? PORTFOLIO.journal[index] : null;
  const scroller = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (scroller.current) scroller.current.scrollTop = 0;
      const onKey = (e) => {
        if (e.key === 'Escape') onClose();
        else if (e.key === 'ArrowRight') onNav(1);
        else if (e.key === 'ArrowLeft') onNav(-1);
      };
      addEventListener('keydown', onKey);
      return () => { removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    }
  }, [open, index]);

  const total = PORTFOLIO.journal ? PORTFOLIO.journal.length : 0;
  const next = open ? PORTFOLIO.journal[(index + 1) % total] : null;
  const hasToc = post?.body?.some(b => b.toc);

  return (
    <div className={`article${open ? ' open' : ''}`} aria-hidden={open ? 'false' : 'true'}>
      <div className="article-scrim" onClick={onClose} />
      {post && (
        <button className="article-close" onClick={onClose} aria-label="Close article">
          <span />Close
        </button>
      )}
      <div className="article-sheet" ref={scroller} data-lenis-prevent="">
        {post && (
          <article className={`article-body${hasToc ? ' has-toc' : ''}`}>
            <div className="a-content">
              {hasToc && <TocMobile body={post.body} />}
              <div className="a-meta">
                <span className="a-tag">{post.tag}</span>
                <span>{post.date}</span>
                <span>{post.read} read</span>
              </div>
              <h1 className="a-title">{post.title}</h1>
              <p className="a-lede">{post.excerpt}</p>
              <div className="a-rule" />
              {post.body.map((b, i) => (
                <BlockRenderer key={i} block={b} />
              ))}
              <div className="a-end">
                <span className="a-mark"><SMMark size={26} /></span>
                <span>Shamit Mishra · {post.date}</span>
              </div>
              {next && (
                <button className="a-next" onClick={() => onNav(1)} data-cursor="view">
                  <span className="a-next-l">Next</span>
                  <span className="a-next-t">{next.title}</span>
                  <span className="a-next-arrow">→</span>
                </button>
              )}
            </div>
            {hasToc && (
              <aside className="a-toc-sidebar">
                <Toc body={post.body} />
              </aside>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
