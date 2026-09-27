// Motion layer on top of App's engine. One function per effect: delete its line in initFx() to drop it.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const on = (el, t, fn) => el.addEventListener(t, fn);

// 1 · The sphere leaves the hero with you: fluid.js springs it to window.__orbT while window.__mid > 0
//   data-orb = radius px · data-orb-x/-y = point inside the anchor (0..1, default .5) · data-orb-follow = ride viewport centre
function companion() {
  const A = gsap.utils.toArray('[data-orb]');
  if (!window.__fluidOk || !window.__lenis || !A.length || !document.querySelector('#about')) return;
  document.documentElement.classList.add('orb');   // sections go see-through onto the (now dark) WebGL void
  // measured here, right after Lenis moves the page, so the WebGL loop never forces a layout mid-frame
  const T = (window.__orbT = {});
  const measure = () => {
    const vh = innerHeight;
    let a = A[0];
    for (const el of A) if (el.getBoundingClientRect().top < vh * 0.6) a = el;
    const b = a.getBoundingClientRect(), d = a.dataset;
    const y = d.orbFollow != null ? Math.min(b.bottom, Math.max(b.top, vh * 0.5)) : b.top + b.height * (d.orbY ?? 0.5);
    T.x = (b.left + b.width * (d.orbX ?? 0.5)) / innerWidth; T.y = 1 - y / vh; T.r = d.orb / vh;
  };
  window.__lenis.on('scroll', measure);
  ScrollTrigger.addEventListener('refresh', measure);
  measure();
  const set = (s) => { window.__mid = s.progress; };
  // dark before About shows: the world fades while the hero is still on its way out, so nothing colourful peeks under the marquee
  ScrollTrigger.create({ trigger: '#about', start: 'top 135%', end: 'top bottom', onUpdate: set, onRefresh: set });
}

// Timeline rail fills as you read; on desktop the sphere rides its tip (data-orb-follow)
function rail() {
  if (!document.querySelector('.tl-rail')) return;
  gsap.fromTo('.tl-rail i', { scaleY: 0 }, { scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.timeline', start: 'top 50%', end: 'bottom 50%', scrub: true } });
}

// 2 · Headings build themselves: chars rise out of line masks with a slight 3D tip
function headings() {
  gsap.utils.toArray('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines,chars', mask: 'lines', linesClass: 'sl', autoSplit: true,
      onSplit: (s) => gsap.fromTo(s.chars,
        { yPercent: 118, rotationX: -75, transformPerspective: 600, transformOrigin: '50% 100%' },
        { yPercent: 0, rotationX: 0, duration: 1.15, ease: 'expo.out', stagger: 0.022,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
    });
  });
}

// 3 · About lede lights up word by word as you scroll through it
function lede() {
  const el = document.querySelector('.about .lede');
  if (!el) return;
  SplitText.create(el, { type: 'words', ignore: '.gradient-text' });   // keep gradient words whole: background-clip breaks on split children
  gsap.fromTo(el.children, { opacity: 0.13 }, { opacity: 1, ease: 'none', stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 42%', scrub: true } });
}

// 4 · Contribution grid ripples in as a diagonal wave (DOM is column-major: 7 cells per week)
function heatmap() {
  const cells = gsap.utils.toArray('.contrib i');
  if (!cells.length) return;
  gsap.from(cells, { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(2.2)',
    stagger: (i) => (Math.floor(i / 7) + (i % 7)) * 0.022,
    scrollTrigger: { trigger: '.contrib', start: 'top 85%', once: true } });
}

// 5 · Project previews tilt toward the cursor with a glare that follows it
function tilt() {
  gsap.utils.toArray('.feat-vis, .gcard .gvis').forEach((el) => {
    gsap.set(el, { transformPerspective: 1000 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3' });
    on(el, 'pointermove', (e) => {
      const b = el.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
      rx((0.5 - py) * 7); ry((px - 0.5) * 9);
      el.style.setProperty('--gx', px * 100 + '%'); el.style.setProperty('--gy', py * 100 + '%');
    });
    on(el, 'pointerleave', () => { rx(0); ry(0); });
  });
}

// 7 · Skills decode from glyph noise when revealed, and again on hover
function skills() {
  const items = gsap.utils.toArray('.skill-col li');
  if (!items.length) return;
  items.forEach((el) => { el.dataset.t = el.textContent; });
  const run = (el, delay = 0) => gsap.to(el, { duration: 0.9, delay, overwrite: true,
    scrambleText: { text: el.dataset.t, chars: '01<>/{}[]#*+=_', speed: 0.7, revealDelay: 0.25 } });
  ScrollTrigger.create({ trigger: '.skills', start: 'top 80%', once: true, onEnter: () => items.forEach((el, i) => run(el, i * 0.035)) });
  items.forEach((el) => on(el, 'mouseenter', () => { if (!gsap.isTweening(el)) run(el); }));
}

// 8 · Footer name rises letter by letter; letters shy away from the cursor
function footerName(fine) {
  const el = document.querySelector('.footer .brand');
  if (!el) return;
  const s = SplitText.create(el, { type: 'chars', mask: 'chars' });
  gsap.from(s.chars, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.06,
    scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true } });
  if (!fine) return;
  const foot = document.querySelector('.footer'), R = 170, P = 26;
  const letters = s.masks.map((m) => ({ m, x: gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3' }), y: gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3' }) }));
  on(foot, 'pointerenter', () => letters.forEach((l) => {   // rest positions, measured once per visit (no transform feedback)
    const b = l.m.getBoundingClientRect();
    l.cx = b.left + b.width / 2 - gsap.getProperty(l.m, 'x'); l.cy = b.top + b.height / 2 - gsap.getProperty(l.m, 'y');
  }));
  on(foot, 'pointermove', (e) => letters.forEach((l) => {
    const dx = l.cx - e.clientX, dy = l.cy - e.clientY, d = Math.hypot(dx, dy) || 1, k = Math.max(0, 1 - d / R) * P;
    l.x(dx / d * k); l.y(dy / d * k);
  }));
  on(foot, 'pointerleave', () => letters.forEach((l) => { l.x(0); l.y(0); }));
}

// 9 · Buttons lean toward the pointer
function magnetic() {
  gsap.utils.toArray('.btn-ghost, .contact .socials a, .nav .lnk, .menu-btn, .nav .brand').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    on(el, 'pointermove', (e) => {
      const b = el.getBoundingClientRect();
      x((e.clientX - b.left - b.width / 2) * 0.35); y((e.clientY - b.top - b.height / 2) * 0.35);
    });
    on(el, 'pointerleave', () => { x(0); y(0); });
  });
}

// 10 (journal title morph) lives in App.openArticle: it needs React's flushSync.

export function initFx({ isMobile }) {
  const fine = matchMedia('(pointer:fine)').matches;
  if (!isMobile) companion();
  rail();
  headings();
  lede();
  heatmap();
  if (fine) tilt();
  skills();
  footerName(fine);
  if (fine) magnetic();
}
