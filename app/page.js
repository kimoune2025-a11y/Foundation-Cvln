'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Volume2, VolumeX, ArrowDown, X, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  WebGL Savane — fullscreen generative shader                        */
/* ------------------------------------------------------------------ */

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v += a*noise(p); p*=2.0; a*=0.5; } return v; }

vec3 skyColor(float y){
  vec3 top = vec3(0.05, 0.08, 0.14);
  vec3 mid = vec3(0.34, 0.22, 0.24);
  vec3 hor = vec3(0.92, 0.56, 0.29);
  vec3 c = mix(hor, mid, smoothstep(0.30, 0.55, y));
  c = mix(c, top, smoothstep(0.52, 1.0, y));
  return c;
}

// top edge of a grass layer -> triangular blades bending with wind
float grassTop(vec2 p, float baseH, float bladeLen, float density, float speed, float sway, float seed, float wind, float lean){
  float x = p.x * density;
  float i = floor(x);
  float f = fract(x);
  float rnd = hash(vec2(i, seed));
  float bend = sin(u_time*speed + i*1.7 + seed*3.0) * sway * wind + lean;
  float spike = 1.0 - abs((f - 0.5) - bend*3.0) * 2.0;
  spike = max(spike, 0.0);
  float tip = baseH + bladeLen*(0.35 + 0.65*rnd);
  return baseH + (tip - baseH)*spike + bend*0.35;
}

// a single swaying acacia silhouette at ground position pos, size s
float acacia(vec2 p, vec2 pos, float s){
  vec2 q = (p - pos) / vec2(s, s);          // q.y up from ground
  float sway = (sin(u_time*0.7 + pos.x*12.0) + 0.4*sin(u_time*1.6 + pos.x*3.0)) * 0.06;
  q.x -= sway * smoothstep(0.0, 0.85, q.y); // top sways more than base
  // trunk (tapering)
  float trunkW = mix(0.035, 0.010, clamp(q.y/0.62, 0.0, 1.0));
  float trunk = step(abs(q.x), trunkW) * step(0.0, q.y) * step(q.y, 0.66);
  // two branches fanning up
  float b1 = step(abs(q.x - (q.y-0.48)*0.85), 0.011) * step(0.46, q.y) * step(q.y, 0.78);
  float b2 = step(abs(q.x + (q.y-0.48)*0.85), 0.011) * step(0.46, q.y) * step(q.y, 0.78);
  // flat-bottomed umbrella canopy with irregular foliage edge
  vec2 c = q - vec2(0.0, 0.82);
  float r = length(c / vec2(0.62, 0.20));
  float ang = atan(c.y, c.x);
  float ne = 0.10 * fbm(vec2(ang*2.5 + pos.x*7.0, u_time*0.04));
  float canopy = 1.0 - smoothstep(0.92 + ne, 1.06 + ne, r);
  canopy *= smoothstep(-0.14, 0.02, c.y);   // keep flat underside
  return clamp(max(max(trunk, canopy), max(b1, b2)), 0.0, 1.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 cam = vec2(sin(u_time*0.05)*0.008, sin(u_time*0.07)*0.005);
  vec2 p = uv + cam;

  vec3 col = skyColor(p.y);
  vec2 sunPos = vec2(0.30, 0.315);
  float sunGlow = exp(-length((p - sunPos)*vec2(aspect,1.0))*1.2);

  // sun + halo, gentle breathing
  float sd = length((p - sunPos) * vec2(aspect, 1.0));
  float pulse = 0.9 + 0.1*sin(u_time*0.15);
  col += vec3(1.0, 0.76, 0.44) * exp(-sd*4.2) * 1.3 * pulse;
  col += vec3(1.0, 0.60, 0.30) * exp(-sd*1.4) * 0.32;

  // faint drifting clouds
  float cl = fbm(vec2(p.x*3.0 + u_time*0.01, p.y*6.0));
  col = mix(col, vec3(0.82,0.62,0.52), smoothstep(0.55,0.92,cl)*smoothstep(0.30,0.72,p.y)*0.10);

  // distant hill line
  float hill = 0.322 + 0.02*fbm(vec2(p.x*2.2, 0.0));
  col = mix(col, vec3(0.08,0.10,0.10), (1.0 - smoothstep(hill-0.003, hill+0.003, p.y))*0.6);

  // ACACIAS (behind grass) — real swaying trees
  float tree = 0.0;
  tree = max(tree, acacia(p, vec2(0.80, 0.300), 0.22));
  tree = max(tree, acacia(p, vec2(0.155, 0.305), 0.16));
  tree = max(tree, acacia(p, vec2(0.52, 0.312), 0.115));
  col = mix(col, vec3(0.03,0.05,0.045), tree*0.95);
  col += vec3(1.0,0.62,0.32) * tree * sunGlow * 0.35;   // rim light from sun

  // wind gust shared across the whole field
  float gust = fbm(vec2(u_time*0.12, 3.0));
  float wind = 0.5 + 0.9*gust;
  float lean = (gust - 0.5) * 0.9;

  // GRASS — 4 layers far -> near
  // L1 far (hazy, light)
  {
    float baseH = 0.300, top = grassTop(p, baseH, 0.05, 300.0, 0.6, 0.008, 1.0, wind, lean*0.5);
    float m = 1.0 - smoothstep(top-0.0026, top+0.0026, p.y);
    float shade = clamp((p.y-baseH)/(top-baseH+0.001), 0.0, 1.0);
    vec3 g = mix(vec3(0.16,0.20,0.13), vec3(0.34,0.30,0.17), shade*shade);
    g += vec3(1.0,0.72,0.42)*shade*shade*sunGlow*0.35;
    col = mix(col, g, m*0.92);
  }
  // L2
  {
    float baseH = 0.255, top = grassTop(p, baseH, 0.085, 200.0, 0.8, 0.013, 2.0, wind, lean*0.7);
    float m = 1.0 - smoothstep(top-0.0024, top+0.0024, p.y);
    float shade = clamp((p.y-baseH)/(top-baseH+0.001), 0.0, 1.0);
    vec3 g = mix(vec3(0.10,0.15,0.09), vec3(0.30,0.26,0.14), shade*shade);
    g += vec3(1.0,0.70,0.40)*shade*shade*sunGlow*0.45;
    col = mix(col, g, m);
  }
  // L3
  {
    float baseH = 0.200, top = grassTop(p, baseH, 0.135, 130.0, 1.0, 0.018, 3.0, wind, lean*0.85);
    float m = 1.0 - smoothstep(top-0.0022, top+0.0022, p.y);
    float shade = clamp((p.y-baseH)/(top-baseH+0.001), 0.0, 1.0);
    vec3 g = mix(vec3(0.06,0.10,0.06), vec3(0.24,0.20,0.11), shade*shade);
    g += vec3(1.0,0.66,0.36)*shade*shade*sunGlow*0.45;
    col = mix(col, g, m);
  }
  // L4 near (dark, tall)
  {
    float baseH = 0.150, top = grassTop(p, baseH, 0.205, 82.0, 1.2, 0.026, 4.0, wind, lean);
    float m = 1.0 - smoothstep(top-0.0020, top+0.0020, p.y);
    float shade = clamp((p.y-baseH)/(top-baseH+0.001), 0.0, 1.0);
    vec3 g = mix(vec3(0.025,0.05,0.035), vec3(0.18,0.15,0.08), shade*shade);
    g += vec3(1.0,0.62,0.34)*shade*shade*sunGlow*0.40;
    col = mix(col, g, m);
  }

  // atmospheric haze at horizon
  col = mix(col, vec3(0.55,0.42,0.32), exp(-abs(p.y-0.30)*7.0)*0.14);

  // floating fireflies / pollen
  float parts = 0.0;
  for(int i=0;i<26;i++){
    float fi = float(i);
    float sx = fract(hash(vec2(fi,1.0)) + u_time*0.006*(0.4+hash(vec2(fi,7.0))));
    float sy = fract(hash(vec2(fi,2.0)) + u_time*0.018*(0.3+hash(vec2(fi,9.0))));
    float d = length((p - vec2(sx,sy)) * vec2(aspect,1.0));
    parts += smoothstep(0.012, 0.0, d) * (0.6 + 0.4*sin(u_time*1.6 + fi));
  }
  col += vec3(1.0, 0.86, 0.62) * parts * 0.6;

  // vignette + fine grain
  float vig = smoothstep(1.2, 0.30, length((uv-0.5)*vec2(aspect,1.0)));
  col *= mix(0.70, 1.0, vig);
  col += (hash(uv*(u_time+1.0)) - 0.5) * 0.015;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(s))
    return null
  }
  return s
}

function SavaneCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let gl
    try {
      gl = canvas.getContext('webgl', { antialias: true, alpha: true }) || canvas.getContext('experimental-webgl')
    } catch (e) { gl = null }
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog)); return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    function resize() {
      const w = Math.floor(window.innerWidth * dpr), h = Math.floor(window.innerHeight * dpr)
      canvas.width = w; canvas.height = h
      canvas.style.width = window.innerWidth + 'px'; canvas.style.height = window.innerHeight + 'px'
      gl.viewport(0, 0, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf
    const start = performance.now()
    function render(now) {
      const t = (now - start) / 1000
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}

/* ------------------------------------------------------------------ */
/*  2D Network overlay — appears with scroll                           */
/* ------------------------------------------------------------------ */

function NetworkOverlay() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let W, H
    function resize() {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const N = 46
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.6 + 0.6,
    }))

    let raf
    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150) {
            const o = (1 - d / 150) * 0.5
            ctx.strokeStyle = `rgba(216,162,74,${o})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(240,222,190,0.85)'
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}

/* ------------------------------------------------------------------ */
/*  Content data                                                       */
/* ------------------------------------------------------------------ */

const QUESTIONS = [
  { q: 'Pourquoi COEURVOLAN ?', a: 'Tout commence par une histoire familiale. Un nom porté comme une promesse. COEURVOLAN est né du désir de transformer une mémoire en élan — faire de nos racines une force qui avance.' },
  { q: 'Pourquoi cette vision ?', a: 'Nous croyons qu’un héritage ne se conserve pas : il se construit. Chaque génération doit pouvoir bâtir sur celle d’avant. Relier ce que nous sommes à ce que nous deviendrons.' },
  { q: 'Pourquoi la culture ?', a: 'La culture est le sol dans lequel tout prend racine. Elle nous rappelle d’où nous venons et éclaire où nous allons. Rien de durable ne se construit sans mémoire.' },
  { q: 'Pourquoi la technologie ?', a: 'La technologie n’est pas une finalité, c’est un outil. Elle prolonge la main de l’humain sans jamais la remplacer. Au service de la transmission, elle devient un pont entre les générations.' },
  { q: 'Pourquoi l’agriculture ?', a: 'La terre nourrit autant les corps que les mémoires. Cultiver, c’est prendre soin du temps long. Tout écosystème commence par le vivant.' },
  { q: 'Pourquoi transmettre ?', a: 'Transmettre, c’est refuser que le savoir s’éteigne avec nous. C’est offrir aux suivants un point de départ plus haut. Un héritage n’a de valeur que s’il continue de circuler.' },
  { q: 'Pourquoi CVLN ?', a: 'CVLN est la structure qui donne un corps à la vision. Elle organise, protège et fait grandir chaque initiative. Là où COEURVOLAN inspire, CVLN construit.' },
  { q: 'Pourquoi créer cet écosystème ?', a: 'Aucune vision ne tient seule. Un écosystème relie les idées, les outils et les personnes. Ensemble, ils forment un tout plus grand que la somme de ses parts.' },
]

// Full architecture of the CVLN Foundation, rendered as an interactive tree
const TREE = {
  name: 'CVLN Foundation', tag: 'Gouvernance · vision · racine',
  desc: 'La racine de tout : la gouvernance, la vision et la raison d’être de l’écosystème.',
  children: [{
    name: 'CVLN Group', tag: 'Écosystème global · portefeuille',
    desc: 'L’écosystème dans son ensemble : le portefeuille vivant des entités du groupe.',
    children: [
      {
        name: 'Meta CVLN', tag: 'Gouvernance groupe · portefeuille',
        desc: 'La gouvernance du groupe et la coordination de son portefeuille d’activités.',
        children: [
          {
            name: 'Infrastructures CVLN', tag: 'Fondations techniques',
            desc: 'Les fondations techniques sur lesquelles tout l’écosystème s’appuie.',
            children: [
              {
                name: 'FREKCORE', tag: 'Identité · provenance · preuve',
                desc: 'Le socle d’identité, de provenance et de preuve. La confiance par la traçabilité.',
                children: [
                  { name: 'FREK-ID', tag: 'Identité', desc: 'L’identité vérifiable des personnes et des œuvres.' },
                  { name: 'FREK-CHAIN', tag: 'Provenance', desc: 'La chaîne qui atteste l’origine et le parcours de chaque création.' },
                  { name: '.FK · FREKANSLA · FREKRAW · Verified', tag: 'Formats · preuve', desc: 'Les formats et labels de preuve : du fichier brut à l’œuvre vérifiée.' },
                ],
              },
              { name: 'Proof Layer', tag: 'Evidence · notarial', desc: 'La couche de preuve : une valeur notariale au service de la confiance.' },
              { name: 'CVLN Wallet', tag: 'Économie · JCC · paiements', desc: 'L’économie de l’écosystème : la monnaie JCC et les paiements.' },
            ],
          },
          {
            name: 'Entités Métier CVLN', tag: 'Activités opérationnelles',
            desc: 'Les activités qui font vivre la culture au quotidien.',
            children: [
              {
                name: 'KORA', tag: 'Streaming · média',
                desc: 'La plateforme de streaming et de média. Le fil des histoires.',
                children: [
                  { name: 'LabelOS', tag: 'Label · droits', desc: 'Le système qui gère les labels, les droits et les identités créatives.' },
                  { name: 'Factory Maker Studio', tag: 'Création · studio', desc: 'Le studio où naissent les créations, les produits et les prototypes.' },
                ],
              },
              { name: 'Kiltikonet', tag: 'Réseau culturel', desc: 'Le réseau culturel qui relie les communautés et les talents.' },
              { name: 'CVLN Academy', tag: 'Formation · skills', desc: 'La formation et la transmission des savoir-faire.' },
            ],
          },
        ],
      },
      {
        name: 'CVLN Intelligence OS', tag: 'Système commun d’intelligence',
        desc: 'Le système d’intelligence partagé par tout l’écosystème.',
        children: [
          {
            name: 'CVLN Brain', tag: 'Intelligence · LLM',
            desc: 'Le cerveau : les modèles de langage et l’intelligence au service de l’humain.',
            children: [
              {
                name: 'CVLN Agent Factory', tag: 'Système nerveux · agents',
                desc: 'Le système nerveux : la fabrique d’agents qui exécutent et automatisent.',
                children: [
                  { name: 'Laurentia', tag: 'Agent · interface métier', desc: 'L’agent et l’interface métier au contact des usages concrets.' },
                ],
              },
            ],
          },
          { name: 'CVLN Command Center', tag: 'Supervision · pilotage', desc: 'La tour de contrôle : supervision et pilotage de l’ensemble.' },
        ],
      },
      {
        name: 'Structures & Entités', tag: 'Opérationnelles · programmes',
        desc: 'Les structures opérationnelles, marques et programmes du groupe.',
        children: [
          { name: 'Culture Connect', tag: 'Programme', desc: 'Un programme de rencontres et de liens culturels.' },
          { name: 'Good Mood', tag: 'Programme', desc: 'Des expériences qui rassemblent et célèbrent le vivant.' },
          { name: 'Good Mood Fest', tag: 'Événement', desc: 'Le festival : l’énergie de la fête et de la communauté.' },
          { name: 'Gala Cook & Food', tag: 'Gastronomie', desc: 'La table comme lieu de partage : une gastronomie de terroir.' },
          { name: 'Factory Maker Academy', tag: 'Formation', desc: 'La formation des créateurs et des makers.' },
          { name: 'KORA Academy', tag: 'Formation', desc: 'La formation aux métiers du média et du streaming.' },
          { name: 'FREK Academy', tag: 'Formation', desc: 'La formation à l’identité, la preuve et la provenance.' },
        ],
      },
    ],
  }],
}

function TreeNode({ node, depth, index = 0, onSelect }) {
  const lg = depth <= 1
  const delay = Math.min(depth * 0.12 + index * 0.05, 0.9)
  return (
    <li>
      <motion.button
        onClick={() => onSelect(node)}
        className={`cvln-node${lg ? ' cvln-node--lg' : ''}`}
        style={{ transformPerspective: 900 }}
        initial={{ opacity: 0, y: 60, z: -220, rotateX: -35, scale: 0.8 }}
        whileInView={{ opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
        whileHover={{ scale: 1.08, z: 50, rotateX: 6, rotateY: -6 }}
      >
        <span className="n">{node.name}</span>
        <span className="t">{node.tag}</span>
      </motion.button>
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((c, i) => (
            <TreeNode key={c.name} node={c} depth={depth + 1} index={i} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  )
}

/* ------------------------------------------------------------------ */
/*  Elegant modal                                                      */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-[#ece7dd]/70 backdrop-blur-sm transition hover:text-[#d8a24a] sm:-top-10 sm:right-0 sm:h-auto sm:w-auto sm:bg-transparent"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
            <div className="max-h-[85vh] overflow-y-auto rounded-2xl border border-[#d8a24a]/20 bg-[#0b0d0e]/95 p-7 shadow-[0_0_80px_rgba(216,162,74,0.08)] sm:p-10">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const reveal = {
  hidden: { opacity: 0, y: 70, rotateX: -22, scale: 0.94 },
  show: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] } },
}

// 3D reveal wrapper — content emerges from depth on scroll-in
function Reveal3D({ children, className, delay = 0, amount = 0.3 }) {
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1300 }}
      initial={{ opacity: 0, y: 80, z: -260, rotateX: -26, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// Mouse-driven 3D tilt stage (used for the whole architecture map)
function TiltStage({ children, className, max = 8 }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 55, damping: 16 })
  const ry = useSpring(useMotionValue(0), { stiffness: 55, damping: 16 })
  const [fine, setFine] = useState(false)
  useEffect(() => {
    try { setFine(window.matchMedia('(pointer: fine)').matches) } catch (e) {}
  }, [])
  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 1.8)
    rx.set(-py * max)
  }
  function onLeave() { rx.set(0); ry.set(0) }

  // Touch devices: no tilt, native horizontal scroll stays perfectly smooth
  if (!fine) return <div className={className}>{children}</div>

  return (
    <div className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: 1600 }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main App                                                           */
/* ------------------------------------------------------------------ */

function App() {
  const savaneRef = useRef(null)
  const networkRef = useRef(null)
  const [soundOn, setSoundOn] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [activeNode, setActiveNode] = useState(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Hero 3D parallax on scroll — content recedes into depth
  const { scrollY } = useScroll()
  const heroZ = useTransform(scrollY, [0, 700], [0, -380])
  const heroRotate = useTransform(scrollY, [0, 700], [0, 16])
  const heroOpacity = useTransform(scrollY, [0, 620], [1, 0])

  useEffect(() => {
    function onScroll() {
      const max = window.innerHeight * 1.4
      const p = Math.min(1, window.scrollY / max)
      if (savaneRef.current) savaneRef.current.style.opacity = String(1 - 0.72 * p)
      if (networkRef.current) networkRef.current.style.opacity = String(0.62 * p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  async function submitContact(e) {
    e.preventDefault()
    if (sending) return
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue.')
      setSent(true)
      setEmail(''); setName(''); setMessage('')
      toast.success('Merci. Nous garderons le lien.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-[#ece7dd]">
      <audio id="cvln-ambience" loop />

      {/* Background layers */}
      <div ref={savaneRef} className="fixed inset-0 z-0" style={{ opacity: 1 }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, #0a1109 0%, #101d0d 12%, #22301a 21%, #4a3a28 28%, #8a4f28 32%, #b46630 35%, #6a4652 52%, #241f38 75%, #0a0e18 100%)',
          }}
        />
        <SavaneCanvas />
      </div>
      <div ref={networkRef} className="pointer-events-none fixed inset-0 z-[1]" style={{ opacity: 0 }}>
        <NetworkOverlay />
      </div>

      {/* Sound toggle — silent until field recordings are provided */}
      <button
        onClick={() => setSoundOn((s) => !s)}
        className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[#ece7dd]/15 bg-black/20 text-[#ece7dd]/70 backdrop-blur-sm transition hover:border-[#d8a24a]/40 hover:text-[#d8a24a] sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        aria-label={soundOn ? 'Couper le son' : 'Activer le son'}
        title={soundOn ? 'Ambiance activée' : 'Ambiance sonore'}
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* ---------------- HERO ---------------- */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="flex flex-col items-center"
          style={{ transformPerspective: 1000, z: heroZ, rotateX: heroRotate, opacity: heroOpacity }}
        >
        <motion.p
          className="mb-5 text-[0.6rem] uppercase tracking-[0.4em] text-[#d8a24a]/75 sm:mb-7 sm:text-[0.7rem] sm:tracking-[0.55em]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.3 }}
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
        >
          Fondation
        </motion.p>

        <motion.h1
          className="font-display text-[2.6rem] font-light leading-none tracking-[0.15em] sm:text-6xl sm:tracking-[0.3em] md:text-8xl md:tracking-[0.35em]"
          initial={{ opacity: 0, y: 40, z: -200, rotateX: -30 }} animate={{ opacity: 1, y: 0, z: 0, rotateX: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1000, textShadow: '0 4px 50px rgba(0,0,0,0.7)' }}
        >
          COEURVOLAN
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xs px-2 text-base font-light leading-relaxed text-[#ece7dd]/85 sm:mt-8 sm:max-w-md sm:text-lg md:text-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }}
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.7)' }}
        >
          Construire un héritage qui traverse les générations.
        </motion.p>

        <motion.button
          onClick={() => scrollTo('questions')}
          className="group mt-10 rounded-full border border-[#d8a24a]/50 bg-black/10 px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-[#ece7dd] backdrop-blur-sm transition-all duration-700 hover:border-[#d8a24a] hover:bg-[#d8a24a]/15 sm:mt-14 sm:px-10 sm:text-sm sm:tracking-[0.3em]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.8 }}
        >
          Commencer
        </motion.button>
        </motion.div>

        <motion.div
          className="absolute bottom-10 text-[#ece7dd]/50"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </section>

      {/* ---------------- QUESTIONS ---------------- */}
      <section id="questions" className="relative z-10 mx-auto max-w-5xl px-5 py-24 sm:px-6 sm:py-32 md:py-40">
        <motion.div
          className="mb-16 text-center sm:mb-24"
          style={{ transformPerspective: 1200 }}
          variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#d8a24a]/80">Le manifeste</p>
          <p className="font-display text-3xl font-light italic text-[#ece7dd]/80 md:text-4xl">
            Une histoire se découvre lentement.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2" style={{ perspective: 1200 }}>
          {QUESTIONS.map((item, i) => (
            <motion.button
              key={item.q}
              onClick={() => setActiveQuestion(item)}
              className="group flex items-center justify-between rounded-xl border border-[#ece7dd]/10 bg-[#0b0d0e]/40 px-8 py-7 text-left backdrop-blur-md transition-colors duration-500 hover:border-[#d8a24a]/40 hover:bg-[#0b0d0e]/60"
              style={{ transformPerspective: 1000 }}
              variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 2) * 0.1 }}
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.03, z: 30 }}
            >
              <span className="font-display text-2xl font-light">{item.q}</span>
              <ArrowUpRight size={18} className="text-[#ece7dd]/30 transition group-hover:text-[#d8a24a]" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* ---------------- ECOSYSTEM / MUSEUM WINGS ---------------- */}
      <section id="ecosysteme" className="relative z-10 mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32 md:py-40">
        <motion.div
          className="mb-16 text-center sm:mb-24"
          style={{ transformPerspective: 1200 }}
          variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#d8a24a]/80">L’architecture de la fondation</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">Une même racine, de multiples branches.</h2>
          <p className="mx-auto mt-6 max-w-xl font-light leading-relaxed text-[#ece7dd]/65">
            De COEURVOLAN aux entités les plus fines, tout descend d’une seule vision.
            Explorez la carte — chaque nœud révèle une entité de l’écosystème.
          </p>
          <p className="mt-4 text-[0.7rem] uppercase tracking-[0.25em] text-[#ece7dd]/35">
            Glissez horizontalement pour parcourir la carte
          </p>
        </motion.div>

        <TiltStage className="w-full">
          <motion.div
            className="cvln-tree-wrap"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1 }}
          >
            <div className="cvln-tree">
              <ul>
                <TreeNode node={TREE} depth={0} onSelect={setActiveNode} />
              </ul>
            </div>
          </motion.div>
        </TiltStage>
      </section>

      {/* ---------------- CLOSING + CONTACT ---------------- */}
      <section id="contact" className="relative z-10 mx-auto max-w-2xl px-5 py-24 sm:px-6 sm:py-32 md:py-40 text-center">
        <motion.div style={{ transformPerspective: 1200 }} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          <h2 className="font-display text-4xl font-light leading-snug md:text-5xl">
            Une vision qui prend racine dans une histoire,<br className="hidden md:block" /> et s’étend vers un avenir collectif.
          </h2>
          <p className="mx-auto mt-8 max-w-md font-light leading-relaxed text-[#ece7dd]/65">
            Si cette vision résonne en vous, laissez-nous une trace. Nous garderons le lien.
          </p>

          {sent ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-14 font-display text-2xl font-light italic text-[#d8a24a]"
            >
              Merci. Le lien est gardé.
            </motion.p>
          ) : (
            <form onSubmit={submitContact} className="mx-auto mt-14 flex max-w-md flex-col gap-4">
              <input
                type="text" placeholder="Votre nom (facultatif)" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-[#ece7dd]/15 bg-black/20 px-6 py-3.5 text-center text-sm font-light text-[#ece7dd] backdrop-blur-sm placeholder:text-[#ece7dd]/40 focus:border-[#d8a24a]/50 focus:outline-none"
              />
              <input
                type="email" required placeholder="Votre adresse e-mail" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-[#ece7dd]/15 bg-black/20 px-6 py-3.5 text-center text-sm font-light text-[#ece7dd] backdrop-blur-sm placeholder:text-[#ece7dd]/40 focus:border-[#d8a24a]/50 focus:outline-none"
              />
              <textarea
                placeholder="Un mot, une intention (facultatif)" value={message}
                onChange={(e) => setMessage(e.target.value)} rows={3}
                className="w-full resize-none rounded-2xl border border-[#ece7dd]/15 bg-black/20 px-6 py-3.5 text-center text-sm font-light text-[#ece7dd] backdrop-blur-sm placeholder:text-[#ece7dd]/40 focus:border-[#d8a24a]/50 focus:outline-none"
              />
              <button
                type="submit" disabled={sending}
                className="mt-2 rounded-full border border-[#d8a24a]/50 px-10 py-3.5 text-sm font-light uppercase tracking-[0.3em] transition-all duration-700 hover:bg-[#d8a24a]/15 disabled:opacity-50"
              >
                {sending ? 'Envoi…' : 'Rester en lien'}
              </button>
            </form>
          )}
        </motion.div>

        <p className="mt-32 font-display text-lg font-light tracking-[0.3em] text-[#ece7dd]/50">COEURVOLAN</p>
      </section>

      {/* ---------------- MODALS ---------------- */}
      <Modal open={!!activeQuestion} onClose={() => setActiveQuestion(null)}>
        {activeQuestion && (
          <>
            <h3 className="font-display text-3xl font-light">{activeQuestion.q}</h3>
            <div className="my-6 h-px w-16 bg-[#d8a24a]/40" />
            <p className="font-light leading-relaxed text-[#ece7dd]/80">{activeQuestion.a}</p>
          </>
        )}
      </Modal>

      <Modal open={!!activeNode} onClose={() => setActiveNode(null)}>
        {activeNode && (
          <>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#d8a24a]/80">{activeNode.tag}</p>
            <h3 className="font-display text-3xl font-light">{activeNode.name}</h3>
            <div className="my-6 h-px w-16 bg-[#d8a24a]/40" />
            <p className="font-light leading-relaxed text-[#ece7dd]/80">{activeNode.desc}</p>
            <button
              onClick={() => toast('Bientôt disponible', { description: 'Cette entité se dévoilera prochainement.' })}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#d8a24a]/50 px-8 py-3 text-sm font-light uppercase tracking-[0.25em] transition hover:bg-[#d8a24a]/15"
            >
              Découvrir <ArrowUpRight size={16} />
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}

export default App
