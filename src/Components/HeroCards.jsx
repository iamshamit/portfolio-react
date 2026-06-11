import React, { useLayoutEffect, useRef, useState } from 'react';

/*
 * Faithful frontpage recreations of each project, from the
 * "Project Hero Cards" design handoff. Each page is composed on a
 * 1250px-wide canvas and scaled to fill its card container; the canvas
 * height stretches with the container so absolutely-positioned content
 * (nav at top, footer rows at bottom) stays anchored at any aspect ratio.
 */

const DM = "'DM Sans', sans-serif";
const SG = "'Space Grotesk', sans-serif";
const CG = "'Cormorant Garamond', serif";
const FC = "'Fira Code', monospace";

const CANVAS_W = 1250;
const CANVAS_H = 781;

function ScaledPage({ background, children }) {
  const ref = useRef(null);
  const [dims, setDims] = useState(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const scale = width / CANVAS_W;
      setDims({ scale, height: height / scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      {dims && (
        <div style={{
          position:'absolute', top:0, left:0,
          width:CANVAS_W, height:Math.max(dims.height, CANVAS_H * 0.6),
          transform:`scale(${dims.scale})`, transformOrigin:'top left',
          background, overflow:'hidden', pointerEvents:'none',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ══════════ 1. AVNi ══════════ */

export function AvniPage() {
  return (
    <ScaledPage background="#000">
      {/* starfield */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize:'58px 58px', opacity:0.22 }} />

      {/* nav */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'70px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 56px', zIndex:10 }}>
        <span style={{ fontFamily:SG, fontSize:'26px', fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>AVNi</span>
        <div style={{ display:'flex', gap:'32px', fontFamily:DM, fontSize:'16px', color:'rgba(255,255,255,0.5)' }}>
          {['Programs','Features','Platform','How it works','Ecosystem'].map(n => <span key={n}>{n}</span>)}
        </div>
        <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
          <span style={{ fontFamily:DM, fontSize:'16px', color:'rgba(255,255,255,0.5)' }}>Login</span>
          <div style={{ padding:'10px 24px', border:'1.5px solid #fff', borderRadius:'28px', fontFamily:DM, fontSize:'16px', fontWeight:600, color:'#fff' }}>Get Started →</div>
        </div>
      </div>

      {/* wireframe sphere */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-52%)' }}>
        <svg width="540" height="540" viewBox="0 0 540 540" fill="none">
          <g stroke="white" strokeWidth="0.8" opacity="0.18">
            <circle cx="270" cy="270" r="262" />
            <ellipse cx="270" cy="270" rx="262" ry="78" />
            <ellipse cx="270" cy="270" rx="262" ry="156" />
            <ellipse cx="270" cy="270" rx="78" ry="262" />
            <ellipse cx="270" cy="270" rx="156" ry="262" />
            <line x1="8" y1="270" x2="532" y2="270" />
            <line x1="270" y1="8" x2="270" y2="532" />
          </g>
          <g stroke="white" strokeWidth="0.6" opacity="0.1">
            <line x1="80" y1="80" x2="460" y2="460" />
            <line x1="460" y1="80" x2="80" y2="460" />
            <line x1="80" y1="175" x2="460" y2="365" />
            <line x1="80" y1="365" x2="460" y2="175" />
            <line x1="175" y1="80" x2="365" y2="460" />
            <line x1="175" y1="460" x2="365" y2="80" />
            <line x1="8" y1="175" x2="532" y2="365" />
            <line x1="8" y1="365" x2="532" y2="175" />
          </g>
        </svg>
      </div>

      {/* center content */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 120px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'18px' }}>
          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'rgba(255,255,255,0.45)' }} />
          <span style={{ fontFamily:DM, fontSize:'15px', letterSpacing:'4px', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>ONE IDENTITY. INFINITE WORKSPACES.</span>
        </div>
        <div style={{ fontFamily:SG, fontSize:'192px', fontWeight:700, color:'#fff', letterSpacing:'-10px', lineHeight:0.82, marginBottom:'22px' }}>AVNi</div>
        <div style={{ fontFamily:DM, fontSize:'27px', color:'rgba(255,255,255,0.5)', marginBottom:'14px', lineHeight:1.4 }}>A virtual network of <strong style={{ color:'#fff', fontWeight:700 }}>IncubaJVYN_</strong></div>
        <div style={{ fontFamily:DM, fontSize:'17px', color:'rgba(255,255,255,0.35)', lineHeight:1.7, maxWidth:'700px', marginBottom:'38px' }}>AVNI connects startups, incubators, and accelerators through a unified programs platform — discover &amp; apply to programs, run cohorts, manage applications, and take your Showcase live from one place.</div>
        <div style={{ display:'flex', gap:'14px' }}>
          <div style={{ padding:'18px 40px', background:'#fff', borderRadius:'8px', fontFamily:DM, fontSize:'19px', fontWeight:600, color:'#000' }}>Open Workspace →</div>
          <div style={{ padding:'18px 40px', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.18)', borderRadius:'8px', fontFamily:DM, fontSize:'19px', color:'#fff' }}>Explore Platform</div>
        </div>
      </div>

      {/* bottom proof */}
      <div style={{ position:'absolute', bottom:'38px', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:'20px', whiteSpace:'nowrap' }}>
        <div style={{ display:'flex' }}>
          {['#484848','#5c5c5c','#3d3d3d','#666'].map((c, i) => (
            <div key={i} style={{ width:'34px', height:'34px', borderRadius:'50%', background:c, border:'2px solid #000', marginRight: i < 3 ? '-9px' : 0 }} />
          ))}
        </div>
        <span style={{ fontFamily:DM, fontSize:'15px', color:'rgba(255,255,255,0.38)' }}>500+ founders, mentors &amp; incubators</span>
        <span style={{ color:'rgba(255,255,255,0.15)', padding:'0 4px' }}>|</span>
        <span style={{ fontFamily:DM, fontSize:'15px', color:'rgba(255,255,255,0.38)' }}>Free to join · One identity, all roles</span>
      </div>
    </ScaledPage>
  );
}

/* ══════════ 2. Nexara ══════════ */

export function NexaraPage() {
  return (
    <ScaledPage background="#0d1117">
      {/* glows */}
      <div style={{ position:'absolute', right:'-80px', bottom:'-80px', width:'620px', height:'620px', borderRadius:'50%', background:'radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 65%)' }} />
      <div style={{ position:'absolute', left:'-60px', bottom:'-40px', width:'380px', height:'380px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 65%)' }} />

      {/* nav */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 52px', zIndex:10 }}>
        <span style={{ fontFamily:SG, fontSize:'22px', fontWeight:700, color:'#fff' }}>Nex<span style={{ color:'#f97316' }}>ara</span></span>
        <div style={{ display:'flex', gap:'28px', fontFamily:DM, fontSize:'15px', color:'rgba(255,255,255,0.5)' }}>
          {['Home','Features','How It Works','Tech Stack','GitHub'].map(n => <span key={n}>{n}</span>)}
        </div>
        <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
          <span style={{ fontFamily:DM, fontSize:'15px', color:'rgba(255,255,255,0.5)' }}>Login</span>
          <div style={{ padding:'10px 22px', background:'#f97316', borderRadius:'6px', fontFamily:DM, fontSize:'15px', fontWeight:600, color:'#fff' }}>Get Started</div>
        </div>
      </div>

      {/* two columns */}
      <div style={{ position:'absolute', top:'80px', left:'52px', right:'52px', bottom:'40px', display:'flex', alignItems:'center', gap:'60px' }}>
        {/* left */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ width:'48px', height:'3px', background:'#f97316', borderRadius:'2px', marginBottom:'22px' }} />
          <div style={{ fontFamily:DM, fontSize:'74px', fontWeight:800, color:'#fff', lineHeight:1.05 }}>Connect. Create.</div>
          <div style={{ fontFamily:DM, fontSize:'74px', fontWeight:800, color:'#f97316', lineHeight:1.1, marginBottom:'22px' }}>Succeed.</div>
          <div style={{ fontFamily:DM, fontSize:'18px', color:'rgba(255,255,255,0.55)', lineHeight:1.65, marginBottom:'30px', maxWidth:'460px' }}>Nexara connects talented freelancers with employers looking for quality work. Simple, secure, and straightforward.</div>
          <div style={{ display:'flex', gap:'14px', marginBottom:'22px', flexWrap:'wrap' }}>
            <div style={{ padding:'14px 32px', background:'#f97316', borderRadius:'6px', fontFamily:DM, fontSize:'17px', fontWeight:600, color:'#fff' }}>Get Started</div>
            <div style={{ padding:'14px 30px', border:'2px solid rgba(255,255,255,0.22)', borderRadius:'6px', fontFamily:DM, fontSize:'17px', color:'#fff' }}>Learn More</div>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', border:'1.5px solid rgba(255,255,255,0.18)', borderRadius:'28px', padding:'8px 18px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#f97316' }} />
            <span style={{ fontFamily:DM, fontSize:'15px', color:'rgba(255,255,255,0.65)' }}><span style={{ color:'#f97316', fontWeight:600 }}>Open Source</span> Project</span>
          </div>
        </div>

        {/* right: dashboard mockup */}
        <div style={{ flex:'0 0 480px' }}>
          <div style={{ borderRadius:'14px', border:'2px solid rgba(249,115,22,0.45)', boxShadow:'0 0 60px rgba(249,115,22,0.18)', overflow:'hidden' }}>
            <div style={{ background:'#1a2035', padding:'10px 16px', display:'flex', alignItems:'center', gap:'7px' }}>
              <div style={{ width:'11px', height:'11px', borderRadius:'50%', background:'#ff5f57' }} />
              <div style={{ width:'11px', height:'11px', borderRadius:'50%', background:'#febc2e' }} />
              <div style={{ width:'11px', height:'11px', borderRadius:'50%', background:'#28c840' }} />
              <span style={{ flex:1, textAlign:'center', fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.4)' }}>Freelancer Dashboard</span>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#f97316', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:DM, fontWeight:700, color:'#fff', fontSize:'13px' }}>A</div>
            </div>
            <div style={{ background:'#151c2c', padding:'18px' }}>
              <div style={{ marginBottom:'14px' }}>
                <div style={{ fontFamily:DM, fontSize:'18px', fontWeight:700, color:'#fff' }}>Welcome back, Alex</div>
                <div style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>Monday, May 19  ★★★★★ 4.0</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'9px', marginBottom:'13px' }}>
                {[['Active Jobs','3'],['Applications','12'],['Earnings','₹1,840']].map(([l, v]) => (
                  <div key={l} style={{ background:'#1e2840', borderRadius:'7px', padding:'12px 14px', borderBottom:'2px solid #f97316' }}>
                    <div style={{ fontFamily:DM, fontSize:'11px', color:'rgba(255,255,255,0.45)' }}>{l}</div>
                    <div style={{ fontFamily:DM, fontSize:'22px', fontWeight:700, color:'#fff' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:'14px', marginBottom:'10px', borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:'8px' }}>
                <span style={{ fontFamily:DM, fontSize:'13px', color:'#f97316', fontWeight:600 }}>Active Projects</span>
                <span style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>Available Jobs</span>
                <span style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>Messages</span>
              </div>
              <div style={{ background:'#1e2840', borderRadius:'7px', padding:'13px 15px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                  <span style={{ fontFamily:DM, fontSize:'14px', fontWeight:600, color:'#fff' }}>Payment Received</span>
                  <span style={{ fontFamily:DM, fontSize:'14px', fontWeight:600, color:'#f97316' }}>₹850</span>
                </div>
                <div style={{ fontFamily:DM, fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'8px' }}>₹500.00</div>
                <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'3px', height:'6px', marginBottom:'5px' }}>
                  <div style={{ background:'#f97316', height:'100%', width:'65%', borderRadius:'3px' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:DM, fontSize:'12px', color:'rgba(255,255,255,0.35)' }}>Progress</span>
                  <span style={{ fontFamily:DM, fontSize:'12px', color:'rgba(255,255,255,0.55)' }}>65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScaledPage>
  );
}

/* ══════════ 3. Portfolio ══════════ */

export function PortfolioPage() {
  return (
    <ScaledPage background="#0a0901">
      {/* bokeh blobs */}
      <div style={{ position:'absolute', right:'40px', top:'40px', width:'680px', height:'680px', borderRadius:'50%', background:'radial-gradient(circle at 42% 48%, rgba(145,112,28,0.92) 0%, rgba(95,72,10,0.65) 28%, transparent 68%)', filter:'blur(38px)', opacity:0.88 }} />
      <div style={{ position:'absolute', right:'-60px', top:'100px', width:'480px', height:'480px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,158,38,0.65) 0%, transparent 62%)', filter:'blur(52px)', opacity:0.5 }} />
      <div style={{ position:'absolute', left:'-80px', top:'220px', width:'380px', height:'380px', borderRadius:'50%', background:'radial-gradient(circle, rgba(100,80,20,0.55) 0%, transparent 62%)', filter:'blur(58px)', opacity:0.4 }} />
      <div style={{ position:'absolute', right:'100px', bottom:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(180,140,30,0.4) 0%, transparent 65%)', filter:'blur(60px)' }} />

      {/* nav */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'68px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 54px', zIndex:10 }}>
        <div style={{ fontFamily:DM, fontSize:'21px', fontWeight:700, lineHeight:1 }}>
          <span style={{ color:'#c9a84c' }}>S</span><span style={{ color:'#fff' }}>M</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
          <div className="blink-dot" style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e' }} />
          <span style={{ fontFamily:DM, fontSize:'13px', letterSpacing:'2.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.45)' }}>Open to Work</span>
        </div>
        <div style={{ display:'flex', gap:'28px', fontFamily:DM, fontSize:'14px', letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.55)' }}>
          <span>Work</span><span>Journal</span><span>Contact</span><span>—</span>
        </div>
      </div>

      {/* main text */}
      <div style={{ position:'absolute', left:'54px', top:'138px' }}>
        <div style={{ fontFamily:DM, fontSize:'14px', letterSpacing:'3.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.38)', marginBottom:'14px' }}>Computer Scientist · Engineer · Builder</div>
        <div style={{ fontFamily:CG, fontSize:'152px', fontWeight:300, color:'#fff', lineHeight:0.88 }}>Shamit</div>
        <div style={{ fontFamily:CG, fontSize:'152px', fontWeight:300, fontStyle:'italic', color:'#fff', lineHeight:0.9, marginBottom:'30px' }}>Mishra.</div>
        <div style={{ fontFamily:DM, fontSize:'17px', color:'rgba(255,255,255,0.5)', lineHeight:1.72, maxWidth:'440px' }}>I design and build modern web applications, resilient backend systems, and AI-powered products — engineering experiences that connect, compute, and inspire.</div>
      </div>

      {/* scroll label */}
      <div style={{ position:'absolute', bottom:'36px', left:'54px', display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ width:'38px', height:'1px', background:'rgba(255,255,255,0.25)' }} />
        <span style={{ fontFamily:DM, fontSize:'11px', letterSpacing:'2.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>Scroll to Explore</span>
      </div>

      {/* location */}
      <div style={{ position:'absolute', bottom:'28px', right:'54px', textAlign:'right' }}>
        <div style={{ fontFamily:DM, fontSize:'11px', letterSpacing:'2.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:'3px' }}>India</div>
        <div style={{ fontFamily:DM, fontSize:'11px', letterSpacing:'2.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>Remote</div>
      </div>
    </ScaledPage>
  );
}

/* ══════════ 4. RAHI ══════════ */

export function RahiPage() {
  return (
    <ScaledPage background="#0a0a14">
      {/* bg radial */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 28% 65%, rgba(80,20,80,0.55) 0%, transparent 52%)' }} />

      {/* nav */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'62px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 52px', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'8px', border:'2px solid #f97316', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color:'#f97316', fontWeight:700 }}>R</div>
          <div>
            <div style={{ fontFamily:SG, fontSize:'17px', fontWeight:700, color:'#fff', lineHeight:1.1 }}>RAHI</div>
            <div style={{ fontFamily:DM, fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>by R2E Technologies</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
          <div style={{ background:'rgba(255,255,255,0.08)', padding:'7px 16px', borderRadius:'20px', fontFamily:DM, fontSize:'14px', color:'rgba(255,255,255,0.7)' }}>Home</div>
          {['Platform','Pricing','About R2E','Contact'].map(n => (
            <span key={n} style={{ fontFamily:DM, fontSize:'14px', color:'rgba(255,255,255,0.45)', padding:'0 8px' }}>{n}</span>
          ))}
        </div>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <div style={{ padding:'9px 20px', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'6px', fontFamily:DM, fontSize:'14px', color:'#fff' }}>Sign In</div>
          <div style={{ padding:'9px 20px', background:'#f97316', borderRadius:'6px', fontFamily:DM, fontSize:'14px', fontWeight:600, color:'#fff' }}>✦ Get Started</div>
        </div>
      </div>

      {/* globe (right) */}
      <div style={{ position:'absolute', right:'-20px', top:'80px', width:'540px', height:'540px' }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle at 35% 32%, #3a2822 0%, #120808 48%, #000 100%)', border:'3px solid rgba(210,80,20,0.55)', boxShadow:'0 0 80px 28px rgba(210,70,10,0.32)' }} />
        {/* continent blobs */}
        <div style={{ position:'absolute', top:'18%', left:'22%', width:'52%', height:'42%', borderRadius:'44%', background:'rgba(80,52,30,0.38)' }} />
        <div style={{ position:'absolute', top:'42%', left:'34%', width:'28%', height:'22%', borderRadius:'50%', background:'rgba(100,62,28,0.28)' }} />
        {/* glow dots */}
        <div style={{ position:'absolute', top:'37%', left:'50%', width:'12px', height:'12px', borderRadius:'50%', background:'#f97316', boxShadow:'0 0 16px #f97316', transform:'translate(-50%,-50%)' }} />
        <div style={{ position:'absolute', top:'44%', left:'38%', width:'9px', height:'9px', borderRadius:'50%', background:'#a855f7', boxShadow:'0 0 12px #a855f7', transform:'translate(-50%,-50%)' }} />
        <div style={{ position:'absolute', top:'56%', left:'62%', width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 10px #22c55e', transform:'translate(-50%,-50%)' }} />
        <div style={{ position:'absolute', top:'28%', left:'70%', width:'8px', height:'8px', borderRadius:'50%', background:'#e879f9', boxShadow:'0 0 10px #e879f9', transform:'translate(-50%,-50%)' }} />
      </div>

      {/* floating badges */}
      <div style={{ position:'absolute', right:'480px', top:'200px', background:'rgba(25,28,48,0.92)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', padding:'10px 16px', fontFamily:DM }}>
        <div style={{ fontSize:'21px', fontWeight:700, color:'#fff' }}>80L+</div>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>Fund Raises</div>
      </div>
      <div style={{ position:'absolute', right:'240px', top:'188px', background:'#f97316', borderRadius:'9px', padding:'10px 18px', display:'flex', alignItems:'center', gap:'8px', fontFamily:DM }}>
        <span style={{ fontSize:'11px', background:'rgba(0,0,0,0.22)', padding:'2px 7px', borderRadius:'4px', color:'#fff', fontWeight:700 }}>IN</span>
        <span style={{ fontSize:'17px', fontWeight:700, color:'#fff' }}>India</span>
      </div>
      <div style={{ position:'absolute', right:'170px', top:'390px', background:'rgba(25,28,48,0.92)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', padding:'10px 16px', fontFamily:DM }}>
        <div style={{ fontSize:'21px', fontWeight:700, color:'#fff' }}>24/7</div>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>Hybrid Tracking</div>
      </div>
      <div style={{ position:'absolute', right:'38px', top:'360px', background:'rgba(25,28,48,0.92)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'9px', padding:'10px 16px', fontFamily:DM }}>
        <div style={{ fontSize:'18px', fontWeight:700, color:'#fff' }}>15+</div>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>IP and Patents</div>
      </div>

      {/* left content */}
      <div style={{ position:'absolute', left:'52px', top:'88px', maxWidth:'590px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'20px', padding:'7px 16px', marginBottom:'20px' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#f97316' }} />
          <span style={{ fontFamily:DM, fontSize:'14px', color:'rgba(255,255,255,0.65)' }}>Bharat Innovator Award 2024 Winner</span>
        </div>
        <div style={{ fontFamily:SG, fontSize:'58px', fontWeight:800, color:'#f97316', letterSpacing:'-1px', lineHeight:1, marginBottom:'5px' }}>RAHI</div>
        <div style={{ fontFamily:DM, fontSize:'17px', color:'rgba(255,255,255,0.4)', marginBottom:'18px' }}>
          <span style={{ color:'#f97316', fontWeight:600 }}>R</span>esilient <span style={{ color:'#f97316', fontWeight:600 }}>A</span>uthorization for <span style={{ color:'#f97316', fontWeight:600 }}>H</span>uman <span style={{ color:'#f97316', fontWeight:600 }}>I</span>dentification
        </div>
        <div style={{ fontFamily:DM, fontSize:'44px', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:'6px' }}>The Connected Intelligence Platform</div>
        <div style={{ fontFamily:DM, fontSize:'44px', fontWeight:800, color:'#8b5cf6', lineHeight:1.15, marginBottom:'18px' }}>for Next-Gen Enterprises</div>
        <div style={{ fontFamily:DM, fontSize:'17px', color:'rgba(255,255,255,0.45)', lineHeight:1.65, marginBottom:'26px' }}>A patented SaaS platform by <strong style={{ color:'#fff' }}>R2E Technologies</strong> — manage teams, companies, infrastructure, and operations from one unified sandbox. Powered by AI. Made in India.</div>
        <div style={{ display:'flex', gap:'14px', marginBottom:'34px', flexWrap:'wrap' }}>
          <div style={{ padding:'14px 28px', background:'#f97316', borderRadius:'8px', fontFamily:DM, fontSize:'16px', fontWeight:600, color:'#fff' }}>✦ Start Free Trial →</div>
          <div style={{ padding:'14px 28px', background:'rgba(255,255,255,0.05)', border:'2px solid rgba(255,255,255,0.15)', borderRadius:'8px', fontFamily:DM, fontSize:'16px', color:'#fff' }}>▷ Get on Play Store</div>
        </div>
        <div style={{ display:'flex', gap:0 }}>
          <div style={{ paddingRight:'24px', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily:DM, fontSize:'11px', color:'rgba(255,255,255,0.32)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'3px' }}>Funded By</div>
            <div style={{ fontFamily:DM, fontSize:'14px', fontWeight:700, color:'rgba(255,255,255,0.65)' }}>STPI, Govt. of India</div>
          </div>
          <div style={{ padding:'0 24px', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily:DM, fontSize:'11px', color:'rgba(255,255,255,0.32)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'3px' }}>Mentoring</div>
            <div style={{ fontFamily:DM, fontSize:'14px', fontWeight:700, color:'rgba(255,255,255,0.65)' }}>IIT Ropar</div>
          </div>
          <div style={{ paddingLeft:'24px' }}>
            <div style={{ fontFamily:DM, fontSize:'11px', color:'rgba(255,255,255,0.32)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'3px' }}>Seed Funding</div>
            <div style={{ fontFamily:DM, fontSize:'14px', fontWeight:700, color:'rgba(255,255,255,0.65)' }}>IIT Tirupati</div>
          </div>
        </div>
      </div>
    </ScaledPage>
  );
}

/* ══════════ 5. SpendWise ══════════ */

const SPENDWISE_STACK = ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Tailwind CSS', 'Framer Motion', 'Vite'];

export function SpendWisePage() {
  return (
    <ScaledPage background="#0a0a0a">
      {/* nav */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'62px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 52px', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'30px', height:'30px', border:'2px solid #10b981', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', color:'#10b981', fontSize:'15px' }}>⊞</div>
          <span style={{ fontFamily:DM, fontSize:'20px', fontWeight:700, color:'#fff' }}>SpendWise</span>
        </div>
        <div style={{ padding:'10px 22px', border:'1.5px solid rgba(255,255,255,0.55)', borderRadius:'22px', fontFamily:DM, fontSize:'15px', color:'#fff', display:'flex', alignItems:'center', gap:'6px' }}>Login →</div>
      </div>

      {/* Live badge */}
      <div style={{ position:'absolute', right:'52px', top:'86px', background:'#10b981', borderRadius:'20px', padding:'6px 14px', fontFamily:DM, fontSize:'13px', fontWeight:700, color:'#fff' }}>Live</div>
      {/* $ circle */}
      <div style={{ position:'absolute', right:'386px', top:'400px', width:'54px', height:'54px', borderRadius:'50%', background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', color:'#fff', fontWeight:700, boxShadow:'0 0 28px rgba(16,185,129,0.45)' }}>$</div>

      {/* main two columns */}
      <div style={{ position:'absolute', top:'80px', left:'52px', right:'52px', bottom:'80px', display:'flex', alignItems:'center', gap:'60px' }}>
        {/* left */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'22px', padding:'7px 18px', marginBottom:'20px' }}>
            <span style={{ color:'#10b981', fontSize:'14px' }}>✦</span>
            <span style={{ fontFamily:DM, fontSize:'14px', color:'rgba(255,255,255,0.65)' }}>Smart finance tracking for everyone</span>
          </div>
          <div style={{ fontFamily:DM, fontSize:'58px', fontWeight:800, color:'#10b981', lineHeight:1.1 }}>Master Your Money</div>
          <div style={{ fontFamily:DM, fontSize:'54px', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:'18px' }}>Shape Your Future</div>
          <div style={{ fontFamily:DM, fontSize:'17px', color:'rgba(255,255,255,0.48)', lineHeight:1.68, maxWidth:'460px', marginBottom:'26px' }}>Stop wondering where your money goes. Start tracking, start saving, start growing. Your personal finance companion that makes money management feel like a breeze.</div>
          <div style={{ display:'flex', gap:'14px', marginBottom:'18px', flexWrap:'wrap' }}>
            <div style={{ padding:'14px 28px', background:'#10b981', borderRadius:'7px', fontFamily:DM, fontSize:'16px', fontWeight:600, color:'#fff' }}>Start Tracking Free →</div>
            <div style={{ padding:'14px 26px', border:'2px solid rgba(255,255,255,0.2)', borderRadius:'7px', fontFamily:DM, fontSize:'16px', color:'#fff' }}>I already have an account</div>
          </div>
          <div style={{ display:'flex', gap:'18px', flexWrap:'wrap' }}>
            {['No credit card required','Free forever plan','Open source project'].map(t => (
              <span key={t} style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.38)', display:'flex', alignItems:'center', gap:'5px' }}><span style={{ color:'#10b981' }}>✓</span> {t}</span>
            ))}
          </div>
        </div>

        {/* right: dashboard */}
        <div style={{ flex:'0 0 440px' }}>
          <div style={{ background:'#0c1a12', border:'1px solid rgba(16,185,129,0.22)', borderRadius:'13px', padding:'22px', boxShadow:'0 0 48px rgba(16,185,129,0.1)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
              <span style={{ fontFamily:DM, fontSize:'17px', fontWeight:700, color:'#fff' }}>Financial Dashboard</span>
              <span style={{ fontFamily:DM, fontSize:'13px', color:'#10b981' }}>April 2024</span>
            </div>
            <div style={{ marginBottom:'16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                <span style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.45)' }}>Monthly Budget</span>
                <span style={{ fontFamily:DM, fontSize:'13px', color:'#10b981' }}>75% on track</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.09)', borderRadius:'4px', height:'8px' }}>
                <div style={{ background:'#10b981', height:'100%', width:'75%', borderRadius:'4px' }} />
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'9px', marginBottom:'14px' }}>
              {[['Income','↑ $4,250','#10b981'],['Expenses','$2,850','#ef4444'],['Savings','$1,400','#fff']].map(([l, v, c]) => (
                <div key={l} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', padding:'11px 12px' }}>
                  <div style={{ fontFamily:DM, fontSize:'11px', color:'rgba(255,255,255,0.38)', marginBottom:'4px' }}>{l}</div>
                  <div style={{ fontFamily:DM, fontSize:'17px', fontWeight:700, color:c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {[['Groceries','72%'],['Entertainment','48%'],['Transport','63%']].map(([l, w]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ fontFamily:DM, fontSize:'12px', color:'rgba(255,255,255,0.42)', width:'90px' }}>{l}</span>
                  <div style={{ flex:1, background:'rgba(255,255,255,0.07)', borderRadius:'3px', height:'5px' }}>
                    <div style={{ background:'#10b981', height:'100%', width:w, borderRadius:'3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* tech stack row */}
      <div style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', whiteSpace:'nowrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'5px 16px' }}>
          <span style={{ fontSize:'12px', color:'#10b981' }}>&lt;/&gt;</span>
          <span style={{ fontFamily:DM, fontSize:'12px', color:'rgba(255,255,255,0.35)' }}>Built With Modern Tech</span>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          {SPENDWISE_STACK.map(t => (
            <div key={t} style={{ border:'1px solid rgba(255,255,255,0.13)', borderRadius:'18px', padding:'4px 13px', fontFamily:DM, fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>{t}</div>
          ))}
        </div>
      </div>
    </ScaledPage>
  );
}

/* ══════════ 6. pasta ══════════ */

export function PastaPage() {
  return (
    <ScaledPage background="#0d0d16">
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' }}>
        {/* top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'15px 22px', background:'#0d0d16', borderBottom:'1px solid rgba(255,255,255,0.055)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'22px', height:'22px', border:'1.5px solid rgba(255,255,255,0.5)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px' }}>📄</div>
            <span style={{ fontFamily:FC, fontSize:'19px', fontWeight:500, color:'#fff', letterSpacing:'-0.5px' }}>pasta</span>
          </div>
          <span style={{ fontSize:'19px', color:'rgba(255,255,255,0.3)' }}>⚙</span>
        </div>

        {/* tab bar */}
        <div style={{ display:'flex', background:'#0d0d16', borderBottom:'1px solid rgba(255,255,255,0.055)', flexShrink:0 }}>
          <div style={{ padding:'13px 26px', fontFamily:DM, fontSize:'17px', color:'#fff', borderBottom:'2px solid #fff' }}>Text</div>
          <div style={{ padding:'13px 26px', fontFamily:DM, fontSize:'17px', color:'rgba(255,255,255,0.3)' }}>Preview</div>
          <div style={{ padding:'13px 26px', fontFamily:DM, fontSize:'17px', color:'rgba(255,255,255,0.3)' }}>How</div>
        </div>

        {/* editor body */}
        <div style={{ flex:1, padding:'26px 22px', background:'#0d0d16' }}>
          <span style={{ fontFamily:FC, fontSize:'17px', color:'rgba(255,255,255,0.18)' }}>Type your markdown here...</span>
        </div>

        {/* bottom bar */}
        <div style={{ display:'flex', alignItems:'stretch', borderTop:'1px solid rgba(255,255,255,0.055)', background:'#0a0a12', flexShrink:0 }}>
          <div style={{ flex:1, padding:'18px 22px', fontFamily:FC, fontSize:'16px', color:'rgba(255,255,255,0.2)' }}>Edit code</div>
          <div style={{ padding:'18px 20px', fontFamily:DM, fontSize:'16px', color:'rgba(255,255,255,0.18)', borderLeft:'1px solid rgba(255,255,255,0.055)', borderRight:'1px solid rgba(255,255,255,0.055)' }}>/ |</div>
          <div style={{ flex:1, padding:'18px 22px', fontFamily:FC, fontSize:'16px', color:'rgba(255,255,255,0.2)' }}>url (optional)</div>
          <div style={{ padding:'18px 26px', background:'rgba(255,255,255,0.05)', fontFamily:DM, fontSize:'16px', color:'rgba(255,255,255,0.65)', fontWeight:600, borderLeft:'1px solid rgba(255,255,255,0.055)' }}>Go</div>
        </div>

        {/* footer */}
        <div style={{ textAlign:'center', padding:'11px', background:'#0d0d16', borderTop:'1px solid rgba(255,255,255,0.04)', flexShrink:0 }}>
          <span style={{ fontFamily:DM, fontSize:'15px', color:'rgba(255,255,255,0.18)' }}>new · how</span>
        </div>
      </div>
    </ScaledPage>
  );
}

/* ══════════ 7. FMHY Search ══════════ */

export function FmhyPage() {
  return (
    <ScaledPage background="#1a1f2e">
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' }}>
        {/* flow launcher nav */}
        <div style={{ background:'#141820', padding:'14px 50px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'11px' }}>
            <div style={{ width:'28px', height:'28px', background:'#3b82f6', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5L6 2L13 13H2Z" fill="white" opacity="0.8" /><path d="M4 7.5L7 3.5L11.5 10H4Z" fill="white" /></svg>
            </div>
            <span style={{ fontFamily:DM, fontSize:'15px', fontWeight:700, color:'#3b82f6', letterSpacing:'1.5px', textTransform:'uppercase' }}>FLOW LAUNCHER</span>
          </div>
          <div style={{ display:'flex', gap:'24px', fontFamily:DM, fontSize:'15px', color:'rgba(255,255,255,0.55)' }}>
            {['Plugins','Theme Builder','Docs','GitHub'].map(n => <span key={n}>{n}</span>)}
          </div>
          <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
            <div style={{ padding:'9px 24px', background:'#3b82f6', borderRadius:'22px', fontFamily:DM, fontSize:'14px', fontWeight:600, color:'#fff' }}>Download</div>
            <span style={{ fontSize:'18px', color:'rgba(255,255,255,0.35)' }}>⚙</span>
          </div>
        </div>

        {/* plugin header */}
        <div style={{ background:'#1a1f2e', padding:'34px 50px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
            <div style={{ width:'66px', height:'66px', borderRadius:'50%', background:'linear-gradient(135deg, #1e2a4a 0%, #0d1117 100%)', border:'2px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M5 15L11 6L25 24H5Z" fill="white" opacity="0.85" /><path d="M9 15L14 8L21 18H9Z" fill="white" /></svg>
            </div>
            <div>
              <div style={{ fontFamily:DM, fontSize:'30px', fontWeight:700, color:'#fff', marginBottom:'4px' }}>FMHY Search</div>
              <div style={{ fontFamily:DM, fontSize:'16px', color:'rgba(255,255,255,0.38)' }}>by iamshamit</div>
            </div>
          </div>
        </div>

        {/* main content */}
        <div style={{ flex:1, display:'flex', padding:'40px 50px', gap:'60px', background:'#1a1f2e', minHeight:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontFamily:DM, fontSize:'18px', color:'rgba(255,255,255,0.65)', lineHeight:1.75, margin:0 }}>Search the Free Media Heck Yeah database</p>
          </div>
          <div style={{ flex:'0 0 400px' }}>
            <div style={{ fontFamily:DM, fontSize:'12px', color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'10px' }}>Install</div>
            <div style={{ background:'#0d1117', borderRadius:'7px', padding:'14px 18px', marginBottom:'8px' }}>
              <code style={{ fontFamily:FC, fontSize:'15px', color:'rgba(255,255,255,0.82)' }}>pm install FMHY Search by iamshamit</code>
            </div>
            <div style={{ background:'rgba(255,255,255,0.06)', padding:'10px', textAlign:'center', borderRadius:'7px', marginBottom:'22px', fontFamily:DM, fontSize:'14px', color:'rgba(255,255,255,0.55)' }}>Copy</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'13px' }}>
              {[['Version','1.0.0'],['Plugin type','Python'],['Latest release','Jun 1, 2026']].map(([l, v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.32)' }}>{l}</span>
                  <span style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.7)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.32)' }}>Source Code</span>
                <span style={{ fontFamily:DM, fontSize:'13px', fontWeight:500, color:'#3b82f6' }}>GitHub</span>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ background:'#141820', padding:'18px 50px', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <span style={{ fontFamily:DM, fontSize:'13px', color:'rgba(255,255,255,0.2)' }}>Flow Launcher Team © 2026</span>
        </div>
      </div>
    </ScaledPage>
  );
}
