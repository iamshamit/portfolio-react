import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import { PORTFOLIO } from './data/config';
import { Cursor, HeroBackdrop, Nav, Overlay } from './Components/Field';
import { Hero, Marquee, About } from './Components/Hero';
import { Featured, Gallery } from './Components/Work';
import { Skills, Timeline, GitHub, Journal, Article, Contact, Footer } from './Components/Sections';
import JournalPage from './Components/JournalPage';

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [menu, setMenu] = React.useState(false);
  // Initialise synchronously from URL so there's no flash on direct /blog/:slug load
  const [article, setArticle] = React.useState(() => {
    const m = window.location.pathname.match(/^\/blog\/(.+)/);
    if (m) {
      const idx = PORTFOLIO.journal.findIndex(p => slugify(p.title) === m[1]);
      return idx >= 0 ? idx : null;
    }
    return null;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const journalLen = PORTFOLIO.journal.length;
  const [originPath, setOriginPath] = React.useState('/');

  const openArticle = (i) => {
    setOriginPath(window.location.pathname);
    setArticle(i);
    navigate(`/blog/${slugify(PORTFOLIO.journal[i].title)}`);
  };

  const closeArticle = () => {
    setArticle(null);
    navigate(originPath);
  };

  const navArticle = (dir) => {
    if (article == null) return;
    const next = (article + dir + journalLen) % journalLen;
    setArticle(next);
    navigate(`/blog/${slugify(PORTFOLIO.journal[next].title)}`);
  };

  // Motion engine — runs once after mount
  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    // Lenis smooth scroll
    let lenis = null;
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.addEventListener('refresh', () => lenis.resize());
      addEventListener('resize', () => lenis.resize());
      window.__lenis = lenis;
    }

    // Anchor / data-scroll smooth jumps
    const onAnchorClick = (e) => {
      const a = e.target.closest('[data-scroll]');
      if (!a) return;
      const id = a.getAttribute('data-scroll');
      const el = id === 'top' ? document.body : document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY;
      if (lenis) lenis.scrollTo(top, { duration: 1.4 });
      else window.scrollTo({ top, behavior: 'smooth' });
    };
    document.addEventListener('click', onAnchorClick);

    // Progress bar
    const prog = document.querySelector('[data-progress]');
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (prog) prog.style.transform = 'scaleX(' + p + ')';
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hero in-view tracking (pause WebGL when off-screen)
    window.__heroInView = true;
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      new IntersectionObserver((es) => { window.__heroInView = es[0].isIntersecting; }, { threshold: 0 }).observe(heroEl);
    }

    // Scroll reveals via IntersectionObserver
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          const el = en.target;
          el.classList.add('in');
          if (el.hasAttribute('data-stagger')) {
            [...el.querySelectorAll(':scope > *')].forEach((k, i) => { k.style.transitionDelay = (i * 0.08) + 's'; });
          }
          io.unobserve(el);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal,[data-stagger]').forEach((el) => io.observe(el));

    if (reduce) return () => {
      document.removeEventListener('click', onAnchorClick);
      removeEventListener('scroll', onScroll);
    };

    // Hero intro animation
    const isMobile = matchMedia('(max-width:760px)').matches || matchMedia('(pointer:coarse)').matches;
    const heroTargets = '[data-hero-eyebrow],[data-hero-line],[data-hero-sub]';
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from('[data-hero-eyebrow]', { yPercent: 120, opacity: 0, duration: 0.9, ease: 'power3.out' })
      .from('[data-hero-line]', { yPercent: 118, opacity: 0, duration: 1.05, ease: 'power4.out', stagger: 0.12 }, '-=0.55')
      .from('[data-hero-sub]', { yPercent: 100, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.65');
    const ensureVisible = () => gsap.set(heroTargets, { opacity: 1, yPercent: 0, clearProps: 'transform,opacity' });
    tl.eventCallback('onComplete', ensureVisible);
    setTimeout(ensureVisible, 3200);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(ensureVisible, 1600); });

    // Ambient blob sine loops
    const amb = [
      ['.hb1 .bi', 9, -11, 1.06, 26],
      ['.hb2 .bi', -12, 9, 1.08, 34],
      ['.hb3 .bi', 13, -7, 1.05, 30],
      ['.hb4 .bi', -9, -13, 1.07, 22],
    ];
    amb.forEach(([sel, x, y, s, dur]) => {
      gsap.to(sel, { xPercent: x, yPercent: y, scale: s, duration: dur, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    gsap.fromTo('.h-light', { opacity: 0.7 }, { opacity: 1, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.h-light', { yPercent: 8, xPercent: -4, duration: 17, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    // Pin hero (desktop only)
    if (!isMobile) {
      const heroTl = gsap.timeline({ scrollTrigger: {
        trigger: '.hero', start: 'top top', end: '+=200%', pin: true, scrub: 1,
        anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => { window.__heroScroll = self.progress; },
      }});
      heroTl.to('.hb1', { yPercent: -8, ease: 'none' }, 0)
            .to('.hb2', { yPercent: -20, ease: 'none' }, 0)
            .to('.hb3', { yPercent: 6, ease: 'none' }, 0)
            .to('.hb4', { yPercent: -28, ease: 'none' }, 0)
            .to('.amb .h-light', { yPercent: -14, ease: 'none' }, 0)
            .to('.hero .well', { yPercent: -6, ease: 'none', duration: 0.6 }, 0)
            .to('.hero .well', { yPercent: -30, opacity: 0, ease: 'power1.in', duration: 0.4 }, 0.6)
            .to('.scroll-cue', { opacity: 0, ease: 'none', duration: 0.25 }, 0)
            .to('.hero .hello', { opacity: 0, ease: 'none', duration: 0.25 }, 0);
    }

    // Parallax on featured visuals (desktop only)
    if (!isMobile) {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const g = el.querySelector('.g');
        gsap.fromTo(el, { yPercent: 8 }, { yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        if (g) gsap.fromTo(g, { scale: 1.18 }, { scale: 1.04, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } });
      });
    }

    // Pinned horizontal gallery (desktop)
    const gal = document.querySelector('[data-gallery]');
    const track = document.querySelector('[data-gallery-track]');
    if (gal && track && !isMobile) {
      const getX = () => track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: () => -getX(), ease: 'none',
        scrollTrigger: {
          trigger: gal, start: 'top top',
          end: () => '+=' + getX(),
          scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
    }

    // Marquee drift + scroll velocity
    const mq = document.querySelector('[data-marquee]');
    if (mq) {
      gsap.to(mq, { xPercent: -33.33, duration: 18, ease: 'none', repeat: -1 });
      ScrollTrigger.create({
        trigger: '.marquee', start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => { gsap.set(mq, { rotate: self.getVelocity() * -0.0008 }); },
      });
    }

    ScrollTrigger.refresh();
    if (lenis) lenis.resize();
    addEventListener('load', () => { ScrollTrigger.refresh(); if (lenis) lenis.resize(); });
    setTimeout(() => { ScrollTrigger.refresh(); if (lenis) lenis.resize(); }, 600);
    setTimeout(() => { ScrollTrigger.refresh(); if (lenis) lenis.resize(); }, 1500);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      removeEventListener('scroll', onScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (lenis) lenis.destroy();
    };
  }, []);

  const isJournal = location.pathname === '/journal';
  const hero = {
    line1: 'Shamit',
    line2: 'Mishra.',
    sub: 'I design and build modern web applications, resilient backend systems, and AI-powered products — engineering experiences that connect, compute, and inspire.',
  };

  return (
    <>
      <Cursor />
      <HeroBackdrop />
      <div className="grain" />
      <div className="progress" data-progress="" />
      {!isJournal && <Nav onOpen={() => setMenu(true)} />}
      {!isJournal && <Overlay open={menu} onClose={() => setMenu(false)} />}

      <Routes>
        <Route path="/journal" element={
          <JournalPage openArticle={openArticle} />
        } />
        <Route path="*" element={
          <>
            <main>
              <Hero hero={hero} />
              <Marquee />
              <About />
              <Featured />
              <Gallery />
              <Skills />
              <Timeline />
              <GitHub />
              <Journal onOpen={openArticle} />
              <Contact />
            </main>
            <Footer />
          </>
        } />
      </Routes>

      <Article index={article} onClose={closeArticle} onNav={navArticle} />
    </>
  );
}
