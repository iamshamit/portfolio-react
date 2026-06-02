import React from 'react';
import { PORTFOLIO } from '../data/config';
import { Field, SMMark } from './Field';
import { BlockRenderer, Toc, TocMobile } from './JournalBlocks';

export function Skills() {
  return (
    <section className="section" id="skills" data-screen-label="Skills">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />04 — Capabilities</div>
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
          <div className="idx"><span className="bar" />05 — Path</div>
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

export function GitHub() {
  const g = PORTFOLIO.github;
  const cells = Array.from({ length: 120 }, (_, i) => {
    const v = (Math.sin(i * 12.9898) * 43758.5453);
    return v - Math.floor(v);
  });

  return (
    <section className="section github" id="github" data-screen-label="GitHub">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />06 — Open Source</div>
          <div className="note">{g.handle}</div>
        </div>
        <div className="gh-inner">
          <div className="gh-l reveal">
            <h2>Built in the open.</h2>
            <p>{g.blurb}</p>
            <div className="gh-stats" data-stagger="">
              {g.stats.map((s, i) => (
                <div key={i}>
                  <div className="n">{s.n}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
            <a className="btn-ghost" href={PORTFOLIO.contact.socials[0].href} target="_blank" rel="noreferrer" style={{ marginTop: '34px' }}>
              View GitHub <span>→</span>
            </a>
          </div>
          <div className="gh-r reveal">
            <div className="contrib" ref={(el) => {
              if (!el) return;
              [...el.children].forEach((c, i) => {
                const a = cells[i];
                c.style.background = a > 0.78
                  ? `rgba(255,172,46,${0.35 + a * 0.55})`
                  : a > 0.5 ? `rgba(160,224,171,${0.18 + a * 0.3})`
                  : `rgba(255,255,255,${0.05 + a * 0.07})`;
              });
            }}>
              {cells.map((_, i) => <i key={i} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact" data-screen-label="Contact">
      <Field />
      <div className="well">
        <div className="eyebrow reveal">Let&apos;s build something</div>
        <h2 className="reveal">
          Say <span className="ital">hello</span>.
        </h2>
        <a className="email reveal" href={`mailto:${PORTFOLIO.contact.email}`} data-cursor="">
          {PORTFOLIO.contact.email}
        </a>
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
  return (
    <section className="section" id="journal" data-screen-label="Journal">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />07 — Journal</div>
          <h2 className="reveal">Notes & writing.</h2>
          <div className="note">{PORTFOLIO.journal.length} entries</div>
        </div>
        <div className="journal reveal" data-stagger="">
          {PORTFOLIO.journal.map((post, i) => (
            <button className="jrow" key={post.num} data-cursor="view" onClick={() => onOpen(i)}>
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
