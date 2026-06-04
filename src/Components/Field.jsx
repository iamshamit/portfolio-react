import React from 'react';
import { PORTFOLIO } from '../data/config';

export function Field() {
  return (
    <div className="field" aria-hidden="true">
      <div className="marble m1" />
      <div className="marble m2" />
      <div className="sphere">
        <div className="glow" />
        <div className="glass" />
        <div className="caustic" />
        <div className="rim" />
        <div className="fresnel" />
        <div className="spec" />
      </div>
      <div className="veil" />
    </div>
  );
}

export function HeroBackdrop() {
  const ref = React.useRef(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current || !window.initFluid) { setFailed(true); return; }
    let inst;
    try { inst = window.initFluid(ref.current); }
    catch (e) { console.warn('fluid init failed', e); setFailed(true); }
    return () => { inst && inst.destroy && inst.destroy(); };
  }, []);

  return (
    <div className="hero-backdrop" aria-hidden="true">
      <canvas className="fluid-canvas" ref={ref} />
      {failed && (
        <div className="field fluid fallback">
          <div className="marble m1" />
          <div className="marble m2" />
          <div className="sphere">
            <div className="glow" />
            <div className="glass" />
            <div className="caustic" />
            <div className="rim" />
            <div className="fresnel" />
            <div className="spec" />
          </div>
        </div>
      )}
    </div>
  );
}

export function HeroAtmosphere() {
  return (
    <div className="amb" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <div className={`hblob hb${i}`} key={i} data-blob={String(i)}>
          <div className="bi" />
        </div>
      ))}
      <div className="h-light" data-light="" />
      <div className="h-haze" />
      <div className="h-vignette" />
    </div>
  );
}

export function Cursor() {
  const dot = React.useRef(null);
  const ring = React.useRef(null);
  const label = React.useRef(null);

  React.useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      if (label.current) label.current.style.transform = `translate(${mx}px,${my + 44}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => {
      const t = e.target.closest('a,button,.chip,.gcard,[data-cursor]');
      document.body.classList.toggle('cursor-hover', !!t);
      const view = e.target.closest('[data-cursor="view"]');
      document.body.classList.toggle('cursor-view', !!view);
    };
    addEventListener('mousemove', onMove);
    addEventListener('mouseover', over);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('mousemove', onMove);
      removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ring} />
      <div className="cursor" ref={dot} />
      <div className="cursor-label" ref={label}>View</div>
    </>
  );
}

let __smN = 0;
export function SMMark({ size = 30, className }) {
  const gid = React.useMemo(() => 'smg-' + (++__smN), []);
  const h = size * (180 / 210);
  return (
    <svg width={size} height={h} viewBox="0 0 210 180" className={className} aria-label="SM">
      <defs>
        <linearGradient id={gid} x1="0" y1="0.1" x2="1" y2="0.9">
          <stop offset="0" stopColor="#a0e0ab" />
          <stop offset="0.5" stopColor="#ffac2e" />
          <stop offset="1" stopColor="#a52d25" />
        </linearGradient>
      </defs>
      <path d="M93 60 C93 45 65 43 55 54 C45 64 53 80 67 85 C83 91 91 103 81 115 C72 124 47 123 39 110"
        fill="none" stroke={`url(#${gid})`} strokeWidth="12" strokeLinecap="round" />
      <path d="M101 130 L101 50 L139 99 L177 50 L177 130"
        fill="none" stroke="currentColor" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Nav({ onOpen }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (ref.current) {
        if (y > last && y > 400) ref.current.classList.add('hide');
        else ref.current.classList.remove('hide');
      }
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav" ref={ref}>
      <a className="brand" href="#top" data-scroll="top" aria-label="Shamit Mishra — home">
        <SMMark size={48} className="brand-mark" />
      </a>
      <div className="center">
        <span className="dot" />
        Open to work
      </div>
      <div className="right">
        <a className="lnk" href="#work" data-scroll="work">Work</a>
        <a className="lnk" href="#journal" data-scroll="journal">Journal</a>
        <a className="lnk" href="#contact" data-scroll="contact">Contact</a>
        <button className="menu-btn" onClick={onOpen} aria-label="Open menu">
          <span /><span />
        </button>
      </div>
    </nav>
  );
}

export function Overlay({ open, onClose }) {
  const links = [
    { l: 'Home', t: 'top' }, { l: 'About', t: 'about' }, { l: 'Work', t: 'work' },
    { l: 'Skills', t: 'skills' }, { l: 'Journal', t: 'journal' }, { l: 'Contact', t: 'contact' },
  ];
  return (
    <div className={`overlay${open ? ' open' : ''}`}>
      <Field />
      <button className="close" onClick={onClose} aria-label="Close menu">×</button>
      <div className="ov-inner">
        <nav className="links">
          {links.map((it, i) => (
            <a key={i} href={`#${it.t}`} data-scroll={it.t} onClick={onClose}>
              <span className="i">{String(i + 1).padStart(2, '0')}</span>
              {it.l}
            </a>
          ))}
        </nav>
        <div className="ov-side">
          <div className="h">Get in touch</div>
          <a href={`mailto:${PORTFOLIO.contact.email}`}>{PORTFOLIO.contact.email}</a>
          {PORTFOLIO.contact.socials.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
