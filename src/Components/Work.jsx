import React from 'react';
import { PORTFOLIO } from '../data/config';

/* ── Gallery mini-UIs ─────────────────────────────────────────────── */

function PortfolioUI() {
  return (
    <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0a0a14 0%,#1a0a2e 50%,#0a1a1a 100%)', display:'flex', flexDirection:'column', padding:'18px 20px', overflow:'hidden' }}>
      {/* orb */}
      <div style={{ position:'absolute', right:'-30px', top:'10%', width:'220px', height:'220px', borderRadius:'50%', background:'radial-gradient(circle,rgba(190,150,50,0.55) 0%,rgba(100,80,30,0.18) 60%,transparent 80%)', pointerEvents:'none' }} />
      {/* nav */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1 }}>
        <img src="/sm-logo.svg" alt="SM" style={{ height:'20px', width:'auto' }} />
        <div style={{ display:'flex', gap:'14px' }}>
          {['Work','Journal','Contact'].map(n=><span key={n} style={{ color:'rgba(255,255,255,0.4)', fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase' }}>{n}</span>)}
        </div>
      </div>
      {/* hero text */}
      <div style={{ marginTop:'auto', position:'relative', zIndex:1 }}>
        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'7px', letterSpacing:'0.18em', marginBottom:'6px' }}>COMPUTER SCIENTIST · ENGINEER · BUILDER</div>
        <div style={{ color:'#fff', fontSize:'30px', fontWeight:300, lineHeight:1.0, letterSpacing:'-0.03em' }}>Shamit</div>
        <div style={{ color:'#fff', fontSize:'30px', fontWeight:300, lineHeight:1.0, letterSpacing:'-0.03em', fontStyle:'italic' }}>Mishra.</div>
      </div>
    </div>
  );
}

function SpendWiseUI() {
  const bars = [38,60,42,82,54,70,48];
  return (
    <div style={{ position:'absolute', inset:0, background:'#0b1510', display:'flex', flexDirection:'column', padding:'18px 20px', overflow:'hidden' }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'14px' }}>
        <div style={{ width:'18px', height:'18px', borderRadius:'4px', background:'#16a34a', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontSize:'9px', fontWeight:700 }}>$</span>
        </div>
        <span style={{ color:'#22c55e', fontSize:'11px', fontWeight:600 }}>SpendWise</span>
      </div>
      {/* balance */}
      <div style={{ marginBottom:'16px' }}>
        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'8px', letterSpacing:'0.12em', marginBottom:'3px' }}>TOTAL BALANCE</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
          <span style={{ color:'#fff', fontSize:'26px', fontWeight:300, letterSpacing:'-0.02em' }}>$4,250</span>
          <span style={{ color:'#22c55e', fontSize:'10px' }}>↑ 12%</span>
        </div>
      </div>
      {/* bar chart */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:'5px', height:'52px', marginBottom:'14px' }}>
        {bars.map((h,i)=>(
          <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:'3px 3px 0 0', background: i===3 ? '#22c55e' : 'rgba(34,197,94,0.22)', transition:'height 0.3s' }} />
        ))}
      </div>
      {/* categories */}
      <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
        {[['Food','#22c55e'],['Transport','#3b82f6'],['Shopping','#f59e0b'],['Health','#ec4899']].map(([l,c])=>(
          <div key={l} style={{ padding:'2px 7px', borderRadius:'99px', background:`${c}1a`, border:`1px solid ${c}33`, color:c, fontSize:'8px', letterSpacing:'0.04em' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function FMHYSearchUI() {
  const results = [
    { title:'uBlock Origin', tag:'Adblock' },
    { title:'Reddit Enhancement Suite', tag:'Browser' },
    { title:'SponsorBlock', tag:'YouTube' },
    { title:'Bitwarden', tag:'Security' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'#0f1117', display:'flex', flexDirection:'column', padding:'18px 20px', overflow:'hidden' }}>
      {/* search bar */}
      <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:'7px', padding:'7px 11px', display:'flex', alignItems:'center', gap:'7px', marginBottom:'14px', border:'1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px' }}>⌕</span>
        <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'10px', flex:1 }}>fmhy search...</span>
        <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'8px', background:'rgba(255,255,255,0.08)', padding:'1px 5px', borderRadius:'3px' }}>⌘K</span>
      </div>
      {/* results */}
      <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
        {results.map((r,i)=>(
          <div key={i} style={{ padding:'7px 9px', borderRadius:'6px', background: i===0 ? 'rgba(59,130,246,0.14)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'space-between', border: i===0 ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent' }}>
            <span style={{ color: i===0 ? '#fff' : 'rgba(255,255,255,0.45)', fontSize:'10px' }}>{r.title}</span>
            <span style={{ color:'#3b82f6', fontSize:'8px', letterSpacing:'0.06em', textTransform:'uppercase' }}>{r.tag}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop:'auto', color:'rgba(255,255,255,0.2)', fontSize:'8px', letterSpacing:'0.08em' }}>POWERED BY FMHY DATABASE</div>
    </div>
  );
}

function PastaUI() {
  const lines = [
    { n:1, tokens:[{ t:'# ', c:'rgba(248,113,113,0.8)' },{ t:'My Paste', c:'rgba(255,255,255,0.8)' }] },
    { n:2, tokens:[] },
    { n:3, tokens:[{ t:'Share text, code, or notes', c:'rgba(147,197,253,0.75)' }] },
    { n:4, tokens:[{ t:'with a ', c:'rgba(255,255,255,0.4)' },{ t:'single link', c:'rgba(134,239,172,0.75)' },{ t:'.', c:'rgba(255,255,255,0.4)' }] },
    { n:5, tokens:[] },
    { n:6, tokens:[{ t:'No account needed.', c:'rgba(134,239,172,0.6)' }] },
    { n:7, tokens:[{ t:'Expires in ', c:'rgba(255,255,255,0.35)' },{ t:'7 days', c:'rgba(253,186,116,0.7)' },{ t:'.', c:'rgba(255,255,255,0.35)' }] },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'#0d0f14', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* toolbar */}
      <div style={{ padding:'9px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
        {['rgba(255,95,86,0.7)','rgba(255,189,46,0.7)','rgba(39,201,63,0.7)'].map((c,i)=>(
          <div key={i} style={{ width:'7px', height:'7px', borderRadius:'50%', background:c }} />
        ))}
        <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'9px', marginLeft:'8px', letterSpacing:'0.06em' }}>pasta.iamshamit.com</span>
      </div>
      {/* editor */}
      <div style={{ display:'flex', flex:1, padding:'12px 0', overflow:'hidden' }}>
        <div style={{ width:'30px', display:'flex', flexDirection:'column', alignItems:'flex-end', paddingRight:'10px', gap:'1px', flexShrink:0 }}>
          {lines.map(l=><span key={l.n} style={{ color:'rgba(255,255,255,0.18)', fontSize:'9px', lineHeight:'1.7' }}>{l.n}</span>)}
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'1px' }}>
          {lines.map(l=>(
            <div key={l.n} style={{ fontSize:'9px', lineHeight:'1.7' }}>
              {l.tokens.map((tk,i)=><span key={i} style={{ color:tk.c }}>{tk.t}</span>)}
              {l.tokens.length === 0 && <span>&nbsp;</span>}
            </div>
          ))}
        </div>
      </div>
      {/* footer */}
      <div style={{ padding:'7px 14px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'8px', letterSpacing:'0.06em' }}>MARKDOWN</span>
        <div style={{ padding:'3px 10px', background:'rgba(255,255,255,0.9)', borderRadius:'4px' }}>
          <span style={{ color:'#0d0f14', fontSize:'8px', fontWeight:700, letterSpacing:'0.04em' }}>CREATE PASTE</span>
        </div>
      </div>
    </div>
  );
}

const GALLERY_UI = {
  'Portfolio':    <PortfolioUI />,
  'SpendWise':    <SpendWiseUI />,
  'FMHY Search':  <FMHYSearchUI />,
  'Pasta':        <PastaUI />,
};

/* ── Featured mini-UIs ────────────────────────────────────────────── */

function AvniUI() {
  const sg = "'Space Grotesk', system-ui, sans-serif";
  return (
    <div style={{ position:'absolute', inset:0, background:'#050505', display:'flex', flexDirection:'column', padding:'14px 16px', overflow:'hidden', fontFamily:sg }}>
      {/* Wordmark + Live pill on same row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <span style={{ fontSize:'15px', fontWeight:800, color:'#ffffff', letterSpacing:'-0.05em', fontFamily:sg }}>AVNI</span>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'99px', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)' }}>
        <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#69f0ae', boxShadow:'0 0 6px #69f0ae' }} />
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'8px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>Live · Open for Applications</span>
        </div>
      </div>
      {/* Program card — mirrors dark-mode ProgramCard */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.07)', padding:'12px', flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* type + featured */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'7px' }}>
          <div style={{ padding:'3px 8px', borderRadius:'6px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize:'9px', fontWeight:600, color:'rgba(255,255,255,0.55)', letterSpacing:'0.04em' }}>Accelerator</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'3px', padding:'3px 8px', borderRadius:'6px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ fontSize:'8px', color:'rgba(255,255,255,0.65)' }}>★</span>
            <span style={{ fontSize:'8px', fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Featured</span>
          </div>
        </div>
        {/* name + org */}
        <div style={{ fontSize:'13px', fontWeight:700, color:'#ffffff', letterSpacing:'-0.05em', marginBottom:'2px', lineHeight:1.1, fontFamily:sg }}>Pre-Seed Incubation Program</div>
        <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', marginBottom:'8px', fontFamily:sg }}>TBI Pune · Pune, India</div>
        {/* tags */}
        <div style={{ display:'flex', gap:'4px', marginBottom:'10px' }}>
          {['DeepTech','SaaS','Fintech'].map(t=>(
            <span key={t} style={{ padding:'2px 7px', borderRadius:'20px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', fontSize:'8px', color:'rgba(255,255,255,0.5)', fontFamily:sg }}>{t}</span>
          ))}
        </div>
        {/* meta grid — matches the 3-col grid in ProgramCard */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px', marginBottom:'10px' }}>
          {[['📅','15 Jan','Deadline'],['👥','20 startups','Seats'],['⏱','6 months','Duration']].map(([ic,v,l])=>(
            <div key={l} style={{ padding:'7px 8px', borderRadius:'8px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize:'9px', marginBottom:'3px' }}>{ic}</div>
              <div style={{ fontSize:'9px', fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:'2px', fontFamily:sg }}>{v}</div>
              <div style={{ fontSize:'7px', color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:sg }}>{l}</div>
            </div>
          ))}
        </div>
        {/* grant + cta — matches bottom row */}
        <div style={{ display:'flex', gap:'8px', marginTop:'auto' }}>
          <div style={{ padding:'8px 12px', borderRadius:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
            <div style={{ fontSize:'14px', fontWeight:800, color:'#ffffff', letterSpacing:'-0.05em', fontFamily:sg }}>₹5L</div>
            <div style={{ fontSize:'7px', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:sg }}>Grant / Support</div>
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.07)', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.12)', cursor:'pointer' }}>
            <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.75)', fontWeight:600, fontFamily:sg }}>View Details ↗</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NexaraUI() {
  const tasks = [
    { title:'Build a REST API for e-commerce', budget:'$850', bids:7, tag:'Backend', hot:true },
    { title:'Design landing page in Figma', budget:'$320', bids:12, tag:'Design', hot:false },
    { title:'Fix React performance issues', budget:'$200', bids:4, tag:'Frontend', hot:false },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'#0d0d10', display:'flex', flexDirection:'column', padding:'18px 20px', overflow:'hidden' }}>
      {/* ambient */}
      <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
      {/* header */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px', position:'relative', zIndex:1 }}>
        <div style={{ width:'20px', height:'20px', borderRadius:'5px', background:'#f97316', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ color:'#fff', fontSize:'9px', fontWeight:800 }}>N</span>
        </div>
        <span style={{ color:'#fff', fontSize:'12px', fontWeight:600 }}>Nexara</span>
        <div style={{ marginLeft:'auto', padding:'3px 8px', background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:'99px' }}>
          <span style={{ color:'#f97316', fontSize:'8px' }}>+ Post a Task</span>
        </div>
      </div>
      {/* tasks */}
      <div style={{ display:'flex', flexDirection:'column', gap:'6px', position:'relative', zIndex:1 }}>
        {tasks.map((t,i)=>(
          <div key={i} style={{ padding:'8px 10px', borderRadius:'7px', background: i===0 ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)', border:`1px solid ${i===0 ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.06)'}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
              <span style={{ color: i===0 ? '#fff' : 'rgba(255,255,255,0.6)', fontSize:'10px', fontWeight: i===0 ? 500 : 400 }}>{t.title}</span>
              <span style={{ color: i===0 ? '#f97316' : 'rgba(255,255,255,0.35)', fontSize:'10px', fontWeight: i===0 ? 600 : 400, flexShrink:0, marginLeft:'8px' }}>{t.budget}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'8px', background:'rgba(255,255,255,0.05)', padding:'1px 6px', borderRadius:'4px' }}>{t.tag}</span>
              <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'8px' }}>{t.bids} applicants</span>
              {t.hot && <span style={{ color:'#f97316', fontSize:'8px', marginLeft:'auto' }}>🔥 Active</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:'auto', color:'rgba(255,255,255,0.2)', fontSize:'8px', letterSpacing:'0.08em', position:'relative', zIndex:1 }}>ESCROW · SECURE PAYMENTS</div>
    </div>
  );
}

function RahiUI() {
  const devices = [
    { id:'TRK-001', lat:'19.2°N', lng:'72.8°E', active:true },
    { id:'TRK-008', lat:'28.6°N', lng:'77.2°E', active:true },
    { id:'TRK-012', lat:'12.9°N', lng:'77.6°E', active:false },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'#07090f', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* topbar */}
      <div style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ color:'#38bdf8', fontSize:'12px', fontWeight:700, letterSpacing:'0.12em' }}>RAHI</span>
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px rgba(34,197,94,0.8)' }} />
          <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'9px' }}>Live · 3 devices</span>
        </div>
      </div>
      {/* globe */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
        <div style={{ width:'110px', height:'110px', borderRadius:'50%', background:'radial-gradient(circle at 38% 38%, rgba(14,165,233,0.28) 0%, rgba(6,182,212,0.12) 45%, rgba(3,105,161,0.04) 70%, transparent 100%)', border:'1px solid rgba(14,165,233,0.18)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', backgroundImage:'repeating-linear-gradient(0deg,rgba(14,165,233,0.07) 0px,transparent 1px,transparent 22px),repeating-linear-gradient(90deg,rgba(14,165,233,0.07) 0px,transparent 1px,transparent 22px)' }} />
          <div style={{ position:'absolute', top:'28%', left:'38%', width:'7px', height:'7px', borderRadius:'50%', background:'#f97316', boxShadow:'0 0 10px rgba(249,115,22,0.9)' }} />
          <div style={{ position:'absolute', top:'48%', left:'58%', width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px rgba(34,197,94,0.9)' }} />
          <div style={{ position:'absolute', top:'64%', left:'28%', width:'6px', height:'6px', borderRadius:'50%', background:'#38bdf8', boxShadow:'0 0 8px rgba(56,189,248,0.9)' }} />
        </div>
      </div>
      {/* device list */}
      <div style={{ padding:'10px 14px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', gap:'5px', flexShrink:0 }}>
        {devices.map((d,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'5px', height:'5px', borderRadius:'50%', background: d.active ? '#22c55e' : '#f59e0b', boxShadow: d.active ? '0 0 5px rgba(34,197,94,0.8)' : 'none', flexShrink:0 }} />
            <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'9px', flex:1, fontFamily:'monospace' }}>{d.id}</span>
            <span style={{ color:'rgba(255,255,255,0.28)', fontSize:'8px' }}>{d.lat}, {d.lng}</span>
            <span style={{ color: d.active ? '#22c55e' : '#f59e0b', fontSize:'8px' }}>{d.active ? 'Active' : 'Idle'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURED_UI = {
  'Avni':   <AvniUI />,
  'Nexara': <NexaraUI />,
  'Rahi':   <RahiUI />,
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
          <a className="btn-ghost" href={p.repo} target="_blank" rel="noreferrer">Code</a>
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
