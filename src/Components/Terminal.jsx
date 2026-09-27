import React from 'react';

// Hidden terminal window: ` or ~ toggles it, Esc closes. Drag by the title bar, resize from the corner,
// traffic lights close / minimise to the dock pill / maximise (double-click the title bar too).
// The shell itself (xterm + commands) lives in terminalShell.js and loads on first open.
const GEO_KEY = 'shamit.term.geo', BOOT_KEY = 'shamit.term.booted';
const MIN_W = 420, MIN_H = 260;
const narrow = () => innerWidth < 760;   // phones: a bottom sheet (CSS), no dragging or resizing
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};

export default function Terminal() {
  const [mode, setMode] = React.useState('closed');   // closed | open | min
  const [max, setMax] = React.useState(false);
  const [size, setSize] = React.useState(null);        // "92 × 24" readout while resizing (null = hidden)
  const win = React.useRef(null), host = React.useRef(null), shell = React.useRef(null), geo = React.useRef(null), wasOpen = React.useRef(false);

  const clampGeo = (g) => {
    const w = Math.min(Math.max(g.w, MIN_W), innerWidth - 16), h = Math.min(Math.max(g.h, MIN_H), innerHeight - 16);
    return { w, h, x: Math.min(Math.max(g.x, 8), innerWidth - w - 8), y: Math.min(Math.max(g.y, 8), innerHeight - h - 8) };
  };
  const applyGeo = () => {
    const g = geo.current, s = win.current.style;
    s.left = g.x + 'px'; s.top = g.y + 'px'; s.width = g.w + 'px'; s.height = g.h + 'px';
  };
  if (!geo.current) {
    const w = Math.min(780, innerWidth - 32), h = Math.min(480, Math.round(innerHeight * 0.68));
    geo.current = clampGeo(store.get(GEO_KEY) || { x: (innerWidth - w) / 2, y: (innerHeight - h) / 2 - 20, w, h });
  }
  React.useLayoutEffect(applyGeo, []);

  // keyboard: toggle / close
  React.useEffect(() => {
    const onKey = (e) => {
      const typing = e.target.closest?.('input, textarea') && !e.target.closest('.term');
      if ((e.key === '`' || e.key === '~') && !typing) { e.preventDefault(); setMode((m) => (m === 'open' ? 'closed' : 'open')); }
      else if (e.key === 'Escape') setMode((m) => (m === 'open' ? 'closed' : m));
    };
    const onOpen = () => setMode('open');
    const onResize = () => { geo.current = clampGeo(geo.current); applyGeo(); };
    addEventListener('keydown', onKey, true);   // capture: xterm swallows Esc/backquote before they bubble
    addEventListener('open-terminal', onOpen);
    addEventListener('resize', onResize);
    return () => { removeEventListener('keydown', onKey, true); removeEventListener('open-terminal', onOpen); removeEventListener('resize', onResize); };
  }, []);

  // open / close / minimise: page scroll pauses while the window is up; the shell boots on first open
  React.useEffect(() => {
    const L = window.__lenis;
    if (mode !== 'open') {
      shell.current?.blur();
      if (wasOpen.current) L?.start();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    L?.stop();
    if (shell.current) { shell.current.focus(); return; }
    let dead = false;
    import('./terminalShell').then(({ createShell }) => createShell(host.current, { onExit: () => setMode('closed') })).then((sh) => {
      if (dead) return;
      shell.current = sh;
      sh.onResize((c, r) => setSize((s) => (s === null ? null : `${c} × ${r}`)));
      sh.boot(!store.get(BOOT_KEY));
      store.set(BOOT_KEY, true);
      sh.focus();
    });
    return () => { dead = true; };
  }, [mode]);

  // minimise: the window flies down into the dock pill (bottom centre)
  const minimise = () => {
    const r = win.current.getBoundingClientRect();
    win.current.style.setProperty('--dx', `${innerWidth / 2 - (r.left + r.width / 2)}px`);
    win.current.style.setProperty('--dy', `${innerHeight - 40 - (r.top + r.height / 2)}px`);
    setMode('min');
  };
  const toggleMax = () => {
    win.current.classList.add('geo-anim');
    setMax((m) => !m);
    setTimeout(() => win.current?.classList.remove('geo-anim'), 480);
  };

  // pointer drag: 'move' from the title bar, or resize from any edge / corner ('n', 'se', 'w', …)
  const drag = (kind) => (e) => {
    if (narrow() || max || e.button !== 0 || e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    const start = { ...geo.current }, sx = e.clientX, sy = e.clientY;
    document.body.dataset.termDrag = kind;   // keeps the right cursor while the pointer races ahead of the edge
    if (kind !== 'move') setSize('');
    const move = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (kind === 'move') { geo.current = clampGeo({ ...start, x: start.x + dx, y: start.y + dy }); applyGeo(); return; }
      const g = { ...start };
      if (kind.includes('e')) g.w = Math.min(Math.max(start.w + dx, MIN_W), innerWidth - 8 - start.x);
      if (kind.includes('s')) g.h = Math.min(Math.max(start.h + dy, MIN_H), innerHeight - 8 - start.y);
      if (kind.includes('w')) { g.w = Math.min(Math.max(start.w - dx, MIN_W), start.x + start.w - 8); g.x = start.x + start.w - g.w; }   // right edge stays put
      if (kind.includes('n')) { g.h = Math.min(Math.max(start.h - dy, MIN_H), start.y + start.h - 8); g.y = start.y + start.h - g.h; }
      geo.current = g;
      applyGeo();
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      delete document.body.dataset.termDrag;
      setSize(null);
      store.set(GEO_KEY, geo.current);
      shell.current?.focus();
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  };

  const cls = ['term', mode === 'open' && 'open', mode === 'min' && 'min', max && 'max'].filter(Boolean).join(' ');
  return (
    <>
      <div className={cls} ref={win} role="dialog" aria-label="Terminal" {...(mode !== 'open' && { inert: '' })}
        onPointerDown={() => shell.current?.focus()}>
        <div className="term-bar" onPointerDown={drag('move')} onDoubleClick={(e) => !e.target.closest('button') && !narrow() && toggleMax()}>
          <div className="lights">
            <button className="tl tl-close" onClick={() => setMode('closed')} aria-label="Close terminal" />
            <button className="tl tl-min" onClick={minimise} aria-label="Minimise terminal" />
            <button className="tl tl-max" onClick={toggleMax} aria-label={max ? 'Restore terminal size' : 'Maximise terminal'} />
          </div>
          <span className="term-title">shamit@portfolio — zsh</span>
          <span className="term-keys"><kbd>esc</kbd></span>
        </div>
        <div className="term-host" ref={host} />
        {size && <div className="term-size">{size}</div>}
        {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((k) => <div key={k} className={`rz rz-${k}`} onPointerDown={drag(k)} aria-hidden="true" />)}
        <div className="term-grip" aria-hidden="true" />
      </div>
      <button className={`term-dock${mode === 'min' ? ' show' : ''}`} onClick={() => setMode('open')} tabIndex={mode === 'min' ? 0 : -1}>
        <i />shamit.sh<span>minimised</span>
      </button>
    </>
  );
}
