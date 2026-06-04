// ============================================================
// fluid.js — WebGL domain-warped "liquid metal" field + glass
// sphere, colored by the Deep Ocean gradient. The sphere refracts
// the field and drifts toward the mouse. Vanilla (no deps).
//
//   initFluid(canvas) -> { destroy() }
//
// Reads the active gradient preset from <html data-grad> so the
// Tweaks panel keeps working. Honors prefers-reduced-motion
// (renders a single static frame).
// ============================================================
(function (global) {
  // Deep Ocean + preset color triplets (0..1 rgb)
  const PRESETS = {
    ocean:  [[160,224,171],[255,172,46],[165,45,37]],
    teal:   [[73,197,182],[47,142,130],[236,208,111]],
    aurora: [[160,224,171],[73,197,182],[79,124,255]],
    ember:  [[255,172,46],[165,45,37],[176,48,110]],
  };
  const norm = (c) => [c[0]/255, c[1]/255, c[2]/255];

  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;

  const FRAG = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_time;
  uniform float u_aspect;
  uniform vec2  u_warp;     // mouse-driven field offset
  uniform vec2  u_sphere;   // sphere center (uv)
  uniform float u_sphereR;  // sphere radius (uv-y units)
  uniform vec3  u_c1, u_c2, u_c3;
  uniform float u_pulse;    // pulsing amber light intensity
  uniform float u_fade;     // global fade (sphere drift-away phase)

  float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
    vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);   // quintic → extra-smooth (silk)
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.62;
    for(int i=0;i<3;i++){ v += a*noise(p); p = p*2.0 + 4.3; a *= 0.45; }   // few octaves → broad soft forms
    return v;
  }

  // smooth satin field colored by the deep-ocean ramp; big sweeping pools
  vec3 field(vec2 uv, float t, vec2 m){
    vec2 p = (uv - 0.5);
    p.x *= u_aspect;
    p = p*0.92 + m*0.16;
    float t2 = t * 0.85;
    vec2 q = vec2( fbm(p + vec2(0.0, t2)),
                   fbm(p + vec2(3.1,1.2) - vec2(0.0, t2*0.7)) );
    vec2 r = vec2( fbm(p + 2.0*q + vec2(1.7,9.2) + t2*0.5),
                   fbm(p + 2.0*q + vec2(8.3,2.8) - t2*0.4) );
    float f = fbm(p + 2.0*r);
    float v = smoothstep(0.08, 0.62, f);                 // most of the frame carries colour
    float b = mix(0.16, 1.12, v);                        // luminous satin, lifted floor (few pure-black valleys)
    float g = clamp(f*0.95 + (r.x-0.5)*0.65 - 0.04, 0.0, 1.0);  // spread low(green)→mid(amber)→high(rust)
    vec3 col = g < 0.5 ? mix(u_c1, u_c2, g*2.0) : mix(u_c2, u_c3, (g-0.5)*2.0);
    return col * b;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    float t = u_time * 0.05;
    vec2 m = u_warp;

    vec3 col = field(uv, t, m);

    // ---- glass sphere ----
    vec2 d = uv - u_sphere; d.x *= u_aspect;
    float dist = length(d);
    float n = dist / u_sphereR;          // 0 centre → 1 edge
    if(n < 1.06){
      // refraction: sample the field magnified + offset through the glass
      vec2 suv = u_sphere + (uv - u_sphere) * mix(0.84, 1.04, n);
      vec3 scol = field(suv + vec2(0.018, -0.01), t*1.06, m*1.2);
      scol *= mix(0.86, 1.05, smoothstep(0.0, 1.0, n));   // soft glass tint toward centre

      float rim = smoothstep(0.7, 1.0, n);
      scol += rim*rim * mix(u_c1, u_c2, 0.5) * 0.42;       // fresnel rim glow

      // warm crescent on the lower-right edge
      float ca = dot(normalize(d + 1e-5), normalize(vec2(0.7,-0.7)));
      scol += smoothstep(0.92,1.0,n) * smoothstep(0.3,1.0,ca) * vec3(1.0,0.84,0.55) * 0.5;

      // soft specular tucked on the upper-left rim
      float spec = smoothstep(0.045, 0.0, length(d - vec2(-u_sphereR*0.52, u_sphereR*0.5)));
      scol += spec * vec3(1.0,0.97,0.9) * 0.28;

      float edge = smoothstep(1.0, 0.975, n);
      col = mix(col, scol, edge);
    }

    // sink the void: gentle vignette + soft darken lower-left for headline legibility
    col *= smoothstep(1.85, 0.2, length(uv - 0.5));
    col *= mix(0.8, 1.0, smoothstep(0.0, 0.55, uv.x + (1.0-uv.y)*0.08));

    // pulsing amber light source near the right edge (small bloom, not a wash)
    vec2 ld = uv - vec2(0.96, 0.4); ld.x *= u_aspect;
    float lg = exp(-dot(ld,ld) * 8.5);
    col += mix(u_c2, vec3(1.0,0.78,0.4), 0.4) * lg * u_pulse * 0.22;

    // very faint warm haze lifting the lower third
    col += u_c2 * 0.012 * smoothstep(0.0, 1.0, uv.y) * u_pulse;

    col = pow(col, vec3(0.98));
    col *= u_fade;
    gl_FragColor = vec4(col, 1.0);
  }`;

  function compile(gl, type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  global.initFluid = function initFluid(canvas){
    const gl = canvas.getContext('webgl', { antialias:false, alpha:false, premultipliedAlpha:false });
    if(!gl){ canvas.style.display='none'; return { destroy(){} }; }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const u = { res:U('u_res'), time:U('u_time'), aspect:U('u_aspect'), warp:U('u_warp'),
                sphere:U('u_sphere'), sphereR:U('u_sphereR'), c1:U('u_c1'), c2:U('u_c2'), c3:U('u_c3'),
                pulse:U('u_pulse'), fade:U('u_fade') };

    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const mobile = matchMedia('(max-width:760px)').matches || matchMedia('(pointer:coarse)').matches;
    const SCALE = mobile ? 0.5 : 0.72;   // render below css size; lighter on phones
    let W = 1, H = 1;
    function syncSize(){
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if(cw < 1 || ch < 1) return;
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.1 : 1.4);
      const nw = Math.max(2, Math.floor(cw * dpr * SCALE));
      const nh = Math.max(2, Math.floor(ch * dpr * SCALE));
      if(nw !== W || nh !== H){ W = nw; H = nh; canvas.width = W; canvas.height = H; gl.viewport(0,0,W,H); }
    }
    syncSize();
    const ro = new ResizeObserver(syncSize); ro.observe(canvas);

    // mouse → eased warp + sphere drift
    let tx=0, ty=0, mx=0, my=0;
    function onMove(e){
      tx = (e.clientX / innerWidth  - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    }
    addEventListener('mousemove', onMove, { passive:true });

    const start = performance.now();
    const smooth = (a,b,x)=>{ const t = Math.max(0, Math.min(1, (x-a)/(b-a))); return t*t*(3-2*t); };
    let raf, running = true;
    function frame(){
      if(!running) return;
      if(window.__heroInView === false){ raf = requestAnimationFrame(frame); return; }  // pause when hero off-screen
      syncSize();   // re-sync buffer to live client size (survives pin reflows)
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      const cols = PRESETS[document.documentElement.dataset.grad] || PRESETS.ocean;
      const motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion')) || 1;
      const time = reduce ? 12.0 : (performance.now() - start) / 1000 * motion;
      const sc = reduce ? 0 : (window.__heroScroll || 0);   // 0..1 hero scroll progress

      // ---- ambient sphere life (slow sine drift + breathing scale) ----
      const driftX = Math.sin(time * 0.30) * 0.021;          // ~±40px @1920w
      const driftY = Math.sin(time * 0.23 + 1.0) * 0.018;    // ~±20px @1080h
      const breathe = 1.0 + (Math.sin(time * 0.34) * 0.5 + 0.5) * 0.05; // 1.00→1.05, ~18s

      let sphX = 0.72 - mx * 0.045 + driftX;
      let sphY = 0.46 + my * 0.05  + driftY;
      let sphR = 0.5 * breathe;

      // scroll phases: 30-60% enlarge · 60-100% drift away
      sphR += smooth(0.3, 0.62, sc) * 0.17;
      const away = smooth(0.6, 1.0, sc);
      sphX += away * 0.5;
      sphY -= away * 0.16;
      sphR *= (1 - away * 0.35);
      const fade = 1 - away * 0.45;        // never fully black; pin releases into next section

      // pulsing amber light (0.8→1→0.8, ~12s)
      const pulse = 0.8 + (Math.sin(time * 0.52) * 0.5 + 0.5) * 0.2;

      // 0-30%: background drifts slowly as you scroll
      const wx = mx + sc * 0.5;
      const wy = my - sc * 0.18;

      gl.uniform2f(u.res, W, H);
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.aspect, W / H);
      gl.uniform2f(u.warp, wx, wy);
      gl.uniform2f(u.sphere, sphX, sphY);
      gl.uniform1f(u.sphereR, sphR);
      gl.uniform1f(u.pulse, pulse);
      gl.uniform1f(u.fade, fade);
      gl.uniform3fv(u.c1, norm(cols[0]));
      gl.uniform3fv(u.c2, norm(cols[1]));
      gl.uniform3fv(u.c3, norm(cols[2]));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if(reduce){ running=false; return; }
      raf = requestAnimationFrame(frame);
    }
    frame();

    return { destroy(){ running=false; cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('mousemove', onMove); } };
  };
})(window);
