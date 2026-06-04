import React from 'react';
import { PORTFOLIO } from '../data/config';
import { HeroAtmosphere } from './Field';

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
      <div className="hello">
        {PORTFOLIO.location.split('·').map((s, i) => (
          <div key={i}>{s.trim()}</div>
        ))}
      </div>
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
          <div className="idx"><span className="bar" />01 — About</div>
          <div className="note">{PORTFOLIO.role}</div>
        </div>
        <div className="about">
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
            <div className="stats reveal" data-stagger="">
              {a.stats.map((s, i) => (
                <div key={i}>
                  <div className="n">{s.n}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
