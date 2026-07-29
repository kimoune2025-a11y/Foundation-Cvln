'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// top edge of a grass layer -> triangular swaying blades
float grassTop(vec2 p, float baseH, float bladeLen, float density, float speed, float sway, float seed){
  float x = p.x * density;
  float i = floor(x);
  float f = fract(x);
  float rnd = hash(vec2(i, seed));
  float bend = sin(u_time*speed + i*1.7 + seed*3.0) * sway;
  float spike = 1.0 - abs((f - 0.5) - bend*3.0) * 2.0;
  spike = max(spike, 0.0);
  float tip = baseH + bladeLen*(0.35 + 0.65*rnd);
  return baseH + (tip - baseH)*spike + bend*0.4;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 cam = vec2(sin(u_time*0.05)*0.008, sin(u_time*0.07)*0.005);
  vec2 p = uv + cam;

  vec3 col = skyColor(p.y);

  // sun near horizon + halo, slow breathing
  vec2 sunPos = vec2(0.30, 0.315);
  float sd = length((p - sunPos) * vec2(aspect, 1.0));
  float pulse = 0.9 + 0.1*sin(u_time*0.15);
  col += vec3(1.0, 0.76, 0.44) * exp(-sd*4.2) * 1.3 * pulse;
  col += vec3(1.0, 0.60, 0.30) * exp(-sd*1.4) * 0.32;

  // faint drifting clouds
  float cl = fbm(vec2(p.x*3.0 + u_time*0.01, p.y*6.0));
  col = mix(col, vec3(0.82,0.62,0.52), smoothstep(0.55,0.92,cl)*smoothstep(0.30,0.72,p.y)*0.10);

  // acacia-like trees on the horizon (silhouettes)
  {
    vec2 c1 = vec2(0.80, 0.345);
    float can = smoothstep(1.0, 0.68, length((p - c1)/vec2(0.115, 0.036)));
    float trunk = step(abs(p.x-0.80), 0.004) * step(p.y, 0.345) * step(0.298, p.y);
    col = mix(col, vec3(0.05,0.06,0.07), max(can, trunk)*0.92);
  }
  {
    vec2 c2 = vec2(0.135, 0.335);
    float can = smoothstep(1.0, 0.70, length((p - c2)/vec2(0.07, 0.028)));
    float trunk = step(abs(p.x-0.135), 0.003) * step(p.y, 0.335) * step(0.305, p.y);
    col = mix(col, vec3(0.05,0.06,0.07), max(can, trunk)*0.85);
  }

  // distant hill line
  float hill = 0.322 + 0.02*fbm(vec2(p.x*2.2, 0.0));
  col = mix(col, vec3(0.08,0.10,0.10), (1.0 - smoothstep(hill-0.003, hill+0.003, p.y))*0.6);

  // GRASS — far -> near (near drawn last, darker, taller)
  float t1 = grassTop(p, 0.300, 0.05, 230.0, 0.6, 0.010, 1.0);
  float m1 = 1.0 - smoothstep(t1-0.0030, t1+0.0030, p.y);
  col = mix(col, mix(vec3(0.19,0.23,0.16), vec3(0.11,0.16,0.11), 0.5), m1*0.92);

  float t2 = grassTop(p, 0.235, 0.10, 130.0, 0.8, 0.016, 2.0);
  float m2 = 1.0 - smoothstep(t2-0.0028, t2+0.0028, p.y);
  vec3 g2 = vec3(0.09,0.14,0.09);
  g2 += vec3(1.0,0.72,0.42) * smoothstep(t2-0.03, t2, p.y) * m2 * 0.26;
  col = mix(col, g2, m2);

  float t3 = grassTop(p, 0.160, 0.20, 70.0, 1.0, 0.024, 3.0);
  float m3 = 1.0 - smoothstep(t3-0.0020, t3+0.0020, p.y);
  vec3 g3 = vec3(0.035,0.06,0.04);
  g3 += vec3(1.0,0.66,0.36) * smoothstep(t3-0.04, t3, p.y) * m3 * 0.22;
  col = mix(col, g3, m3);

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
    if (!gl) return // CSS gradient fallback stays visible

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

const POLES = [
  {
    name: 'Gouvernance',
    desc: 'La colonne vertébrale de l’écosystème : direction, cohérence et vision long terme.',
    platforms: [
      { name: 'CVLN Holding', desc: 'La structure mère qui porte la vision et coordonne l’ensemble de l’écosystème.' },
      { name: 'CVLN Command Center', desc: 'Le centre de pilotage : une vue d’ensemble pour décider avec clarté et sérénité.' },
    ],
  },
  {
    name: 'Tech & Data',
    desc: 'La fabrique du futur, où les idées deviennent des outils au service de l’humain.',
    platforms: [
      { name: 'CVLN Agent Factory', desc: 'La fabrique d’agents intelligents au service des projets et des personnes.' },
      { name: 'Factory Maker Studio', desc: 'L’atelier où les idées deviennent produits, outils et prototypes.' },
    ],
  },
  {
    name: 'Fintech',
    desc: 'Faire circuler la valeur au sein de la communauté, avec confiance.',
    platforms: [
      { name: 'CVLN Wallet', desc: 'Un portefeuille pensé pour faire circuler la valeur au sein de la communauté.' },
    ],
  },
  {
    name: 'Events',
    desc: 'L’énergie de la rencontre : rassembler, célébrer, créer du lien.',
    platforms: [
      { name: 'Good Mood', desc: 'Des expériences qui rassemblent et célèbrent la culture et le vivant.' },
    ],
  },
  {
    name: 'Média & Content',
    desc: 'La voix de l’écosystème : récits, sons et images qui font vibrer la culture.',
    platforms: [
      { name: 'FREKCORE', desc: 'La voix créative — sons, images et récits qui font vibrer la culture.' },
      { name: 'KORA', desc: 'Le fil qui relie les histoires. Un média au service de la mémoire vivante.' },
    ],
  },
  {
    name: 'Éducation',
    desc: 'La connaissance comme héritage partagé, transmis de génération en génération.',
    platforms: [
      { name: 'CVLN Academy', desc: 'Apprendre, transmettre, grandir. La connaissance comme héritage partagé.' },
    ],
  },
  {
    name: 'Impact & Normes',
    desc: 'Mesurer, garantir, respecter : une croissance responsable et durable.',
    platforms: [
      { name: 'Impact & Normes', desc: 'Mesurer notre empreinte, garantir nos engagements, respecter le vivant.' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Elegant modal                                                      */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
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
            <button onClick={onClose} className="absolute -top-10 right-0 text-[#ece7dd]/60 transition hover:text-[#d8a24a]" aria-label="Fermer">
              <X size={22} />
            </button>
            <div className="rounded-2xl border border-[#d8a24a]/20 bg-[#0b0d0e]/90 p-10 shadow-[0_0_80px_rgba(216,162,74,0.08)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
}

/* ------------------------------------------------------------------ */
/*  Main App                                                           */
/* ------------------------------------------------------------------ */

function App() {
  const savaneRef = useRef(null)
  const networkRef = useRef(null)
  const [soundOn, setSoundOn] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [activePlatform, setActivePlatform] = useState(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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

  const scrollToQuestions = useCallback(() => {
    document.getElementById('questions')?.scrollIntoView({ behavior: 'smooth' })
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
        {/* CSS gradient fallback — savane at dawn (visible even if WebGL fails) */}
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
        className="fixed right-6 top-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#ece7dd]/15 bg-black/20 text-[#ece7dd]/70 backdrop-blur-sm transition hover:border-[#d8a24a]/40 hover:text-[#d8a24a]"
        aria-label={soundOn ? 'Couper le son' : 'Activer le son'}
        title={soundOn ? 'Ambiance activée' : 'Ambiance sonore'}
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* ---------------- HERO ---------------- */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1
          className="font-display text-6xl font-light tracking-[0.35em] sm:text-7xl md:text-8xl"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ textShadow: '0 4px 50px rgba(0,0,0,0.7)' }}
        >
          COEURVOLAN
        </motion.h1>

        <motion.p
          className="mt-8 max-w-md text-lg font-light leading-relaxed text-[#ece7dd]/85 md:text-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }}
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.7)' }}
        >
          Construire un héritage qui traverse les générations.
        </motion.p>

        <motion.button
          onClick={scrollToQuestions}
          className="group mt-14 rounded-full border border-[#d8a24a]/50 bg-black/10 px-10 py-3 text-sm font-light uppercase tracking-[0.3em] text-[#ece7dd] backdrop-blur-sm transition-all duration-700 hover:border-[#d8a24a] hover:bg-[#d8a24a]/15"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.8 }}
        >
          Commencer
        </motion.button>

        <motion.div
          className="absolute bottom-10 text-[#ece7dd]/50"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </section>

      {/* ---------------- QUESTIONS ---------------- */}
      <section id="questions" className="relative z-10 mx-auto max-w-5xl px-6 py-40">
        <motion.p
          className="mb-24 text-center font-display text-3xl font-light italic text-[#ece7dd]/75 md:text-4xl"
          variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}
        >
          Une histoire se découvre lentement.
        </motion.p>

        <div className="grid gap-5 sm:grid-cols-2">
          {QUESTIONS.map((item, i) => (
            <motion.button
              key={item.q}
              onClick={() => setActiveQuestion(item)}
              className="group flex items-center justify-between rounded-xl border border-[#ece7dd]/10 bg-[#0b0d0e]/40 px-8 py-7 text-left backdrop-blur-md transition-all duration-500 hover:border-[#d8a24a]/40 hover:bg-[#0b0d0e]/60"
              variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 2) * 0.1 }}
            >
              <span className="font-display text-2xl font-light">{item.q}</span>
              <ArrowUpRight size={18} className="text-[#ece7dd]/30 transition group-hover:text-[#d8a24a]" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* ---------------- ECOSYSTEM ---------------- */}
      <section id="ecosysteme" className="relative z-10 mx-auto max-w-6xl px-6 py-40">
        <motion.div
          className="mb-24 text-center"
          variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#d8a24a]/80">L’écosystème</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">La technologie naît de nos racines.</h2>
          <p className="mx-auto mt-6 max-w-xl font-light leading-relaxed text-[#ece7dd]/65">
            Des particules deviennent des connexions. Chaque pôle relie des plateformes,
            et chaque plateforme sert la même vision.
          </p>
        </motion.div>

        <div className="space-y-16">
          {POLES.map((pole, pi) => (
            <motion.div
              key={pole.name}
              variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            >
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-light tabular-nums text-[#d8a24a]/60">{String(pi + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl font-light tracking-wide md:text-3xl">{pole.name}</h3>
                <span className="hidden flex-1 border-t border-[#ece7dd]/10 sm:block" />
              </div>
              <p className="mb-8 max-w-2xl pl-10 font-light leading-relaxed text-[#ece7dd]/60">{pole.desc}</p>
              <div className="flex flex-wrap gap-4 pl-10">
                {pole.platforms.map((pf) => (
                  <button
                    key={pf.name}
                    onClick={() => setActivePlatform({ ...pf, pole: pole.name })}
                    className="group relative flex items-center gap-3 rounded-full border border-[#ece7dd]/12 bg-[#0b0d0e]/50 px-6 py-3 backdrop-blur-md transition-all duration-500 hover:border-[#d8a24a]/50 hover:bg-[#0b0d0e]/70"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d8a24a]/40" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d8a24a]" />
                    </span>
                    <span className="text-sm font-light tracking-wide">{pf.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- CLOSING + CONTACT ---------------- */}
      <section id="contact" className="relative z-10 mx-auto max-w-2xl px-6 py-40 text-center">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
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

      <Modal open={!!activePlatform} onClose={() => setActivePlatform(null)}>
        {activePlatform && (
          <>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#d8a24a]/80">{activePlatform.pole}</p>
            <h3 className="font-display text-3xl font-light">{activePlatform.name}</h3>
            <div className="my-6 h-px w-16 bg-[#d8a24a]/40" />
            <p className="font-light leading-relaxed text-[#ece7dd]/80">{activePlatform.desc}</p>
            <button
              onClick={() => toast('Bientôt disponible', { description: 'Cette plateforme se dévoilera prochainement.' })}
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
