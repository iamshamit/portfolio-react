import React from 'react';
import { PORTFOLIO } from '../data/config';
import { HeroAtmosphere } from './Field';
import LocalTime from './LocalTime';
import { API, onActivity, shortArtists } from '../api';

const since = (iso) => {
  const m = (Date.now() - new Date(iso)) / 60000;
  return m < 1 ? 'just now' : m < 60 ? `${Math.floor(m)}m ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`;
};
const RECENT_PUSH = 48 * 3600 * 1000;
const shortTitle = (t) => t.replace(/\s*[([](?:from|feat\.?|with|ft\.?)\s[^)\]]*[)\]]/gi, '').trim();   // Coca Cola (From "Luka Chuppi") → Coca Cola

// bottom-right of the hero: your note as a bubble, then local time, then the most alive thing right now:
// music playing → a recent push → the time-of-day status. Updates live (see api.js onActivity).
function HeroActivity() {
  const [a, setA] = React.useState(null);
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    if (!API) return;
    const off = onActivity(setA);
    const id = setInterval(() => tick((n) => n + 1), 60000);   // keeps "12m ago" honest
    return () => { off(); clearInterval(id); };
  }, []);
  const push = a?.push && Date.now() - new Date(a.push.at) < RECENT_PUSH ? a.push : null;
  return (
    <div className="hello">
      {a?.note && (
        <div className="note-bubble" key={a.note.text + a.note.at} role="status">
          <span className="nb-text">{a.note.text}</span>
          <span className="nb-meta">note · {since(a.note.at)}</span>
        </div>
      )}
      <LocalTime>{(t) => (<>
        <div>{PORTFOLIO.location.split('·')[0].trim()} · {t.time}</div>
        {a?.music ? (
          <a className="status live" key={'m' + a.music.title} href={a.music.url} target="_blank" rel="noreferrer">
            <span className="np-bars live" aria-hidden="true"><i /><i /><i /></span>
            Listening to {shortTitle(a.music.title)} · {shortArtists(a.music.artist)}
          </a>
        ) : push ? (
          <a className="status live" key={'p' + push.at} href={`https://github.com/${PORTFOLIO.github.handle.replace('@', '')}/${push.repo}`} target="_blank" rel="noreferrer">
            <span className="push-dot" aria-hidden="true" />Pushed to {push.repo} · {since(push.at)}
          </a>
        ) : (
          <div className="status">{t.status}</div>
        )}
      </>)}</LocalTime>
    </div>
  );
}

export function Hero({ hero }) {
  const h = hero || PORTFOLIO.hero;
  return (
    <header className="hero" id="top" data-screen-label="Hero">
      <HeroAtmosphere />
      <div className="well">
        <div className="eyebrow">
          <span data-hero-eyebrow="">{PORTFOLIO.eyebrow}</span>
        </div>
        <h1>
          <span className="ln"><span data-hero-line="">{h.line1}</span></span>
          <span className="ln"><span className="ital" data-hero-line="">{h.line2}</span></span>
        </h1>
        <p className="sub">
          <span data-hero-sub="">{h.sub}</span>
        </p>
      </div>
      <div className="scroll-cue">
        <span className="line" />Scroll to explore
      </div>
      <HeroActivity />
    </header>
  );
}

export function Marquee() {
  const items = ['Web Applications', 'Backend Systems', 'AI Products', 'Design Engineering', 'Distributed Systems', 'Real-Time'];
  const loop = [...items, ...items, ...items];
  return (
    <section className="marquee" aria-hidden="true">
      <div className="track" data-marquee="">
        {loop.map((s, i) => (
          <React.Fragment key={i}>
            <span>{s}</span>
            <span className="dot">✦</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export function About() {
  const a = PORTFOLIO.about;
  return (
    <section className="section" id="about" data-screen-label="About">
      <div className="well">
        <div className="sec-head">
          <div className="idx"><span className="bar" />About</div>
          <div className="note">{PORTFOLIO.role}</div>
        </div>
        <div className="about" data-orb="64" data-orb-x=".2" data-orb-y="1.15">
          <div className="col-l">
            <p className="lede reveal">
              I treat the browser as a{' '}
              <span className="gradient-text">canvas</span>
              {' '}and the server as a{' '}
              <span className="gradient-text">craft</span>.
            </p>
          </div>
          <div className="col-r">
            <div className="body reveal">
              {a.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
