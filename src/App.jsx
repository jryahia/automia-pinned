import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowUpRight, Check, Clock, Shield, BadgeCheck, Gauge, Zap, Code2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf); gsap.ticker.lagSmoothing(0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop()
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])
}

const SplitWords = ({ text, className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 60%'] })
  const words = text.split(' ')
  const ys = words.map((w, i) => useTransform(scrollYProgress, [i / words.length, (i + 1.2) / words.length], ['115%', '0%'], { clamp: true }))
  return (
    <h2 ref={ref} className={className} aria-label={text}>{words.map((w, i) => (
      <span key={i} className="wmask" aria-hidden="true"><motion.span style={{ y: ys[i], display: 'inline-block' }}>{w}</motion.span>{'\u00A0'}</span>
    ))}</h2>
  )
}
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 65%'] })
  const y = useTransform(scrollYProgress, [0, 1], [48, 0])
  const o = useTransform(scrollYProgress, [0, 0.35], [0, 1])
  return <motion.div ref={ref} style={{ y, opacity: o, transition: `opacity .1s linear ${delay}s` }}>{children}</motion.div>
}
const Magnetic = ({ children, strength = 0.3 }) => {
  const ref = useRef(null)
  return <motion.div ref={ref}
    onMouseMove={(e) => { const el = ref.current, r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)` }}
    onMouseLeave={() => { ref.current.style.transform = 'translate(0,0)' }} style={{ transition: 'transform .4s cubic-bezier(.22,1,.36,1)' }}>{children}</motion.div>
}

const Header = () => (
  <header className="site-header"><div className="header-inner">
    <a href="#" className="logo">Pinned<span>.</span></a>
    <nav><a href="#work">Work</a><a href="#results">Results</a><a href="#pricing">Pricing</a><a href="#process">Process</a>
      <Magnetic><motion.a href="#contact" whileHover={{ scale: 1.05 }} className="btn-cta">Start a project</motion.a></Magnetic>
    </nav>
  </div></header>
)

const Hero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']); const o = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  return (
    <section ref={ref} className="hero"><motion.div className="hero-inner" style={{ y, opacity: o }}>
      <p className="kicker">Narrative scroll studio — design + dev, one team</p>
      <h1>
        <motion.span className="hw" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .3 }}>Stories</motion.span>
        <motion.span className="hw accent" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .42 }}>you scroll</motion.span>
        <motion.span className="hw" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .54 }}>through.</motion.span>
      </h1>
      <motion.p className="hero-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}>Cinematically sponsored, scroll-scrubbed websites that keep people reading to the last pixel — and convert while they do.</motion.p>
      <motion.div className="hero-ctas" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .95 }}>
        <Magnetic><motion.a href="#contact" whileHover={{ scale: 1.06 }} className="btn-primary">Get a free quote <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></motion.a></Magnetic>
        <Magnetic><motion.a href="#pinned" whileHover={{ scale: 1.06 }} className="btn-ghost">Experience the scroll</motion.a></Magnetic>
      </motion.div>
    </motion.div></section>
  )
}

const PinnedScene = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1.3]); const spin = useTransform(scrollYProgress, [0, 1], [-4, 6])
  const t = useTransform(scrollYProgress, [0, 1], ['0%', '40%']); const o = useTransform(scrollYProgress, [0, 0.7], [1, 0.1])
  return (
    <section ref={ref} className="pin-scene" id="pinned">
      <div className="pin-sticky">
        <motion.div className="pin-visual" style={{ scale, rotate: spin }}>
          <div className="pin-orb" style={{ transform: `translateY(${0}px)` }} />
          <div className="pin-core">SAAS<br />STORY</div>
        </motion.div>
        <motion.h2 className="pin-word" style={{ y: t }}>A 320vh of motion — pinned, scrubbed, yours.</motion.h2>
        <motion.div className="pin-chip" style={{ opacity: o }}><span>↕ scroll scrubbing the scene in real time</span></motion.div>
      </div>
    </section>
  )
}

const Stack = () => {
  const stack = ['GSAP', 'ScrollTrigger', 'React', 'framer-motion', 'lenis', 'TypeScript', 'Three.js', 'Vite']
  const metrics = [
    { icon: <Gauge size={18} />, n: '60fps', l: 'Scrubbed motion' },
    { icon: <Zap size={18} />, n: '0.9s', l: 'Avg page load' },
    { icon: <Code2 size={18} />, n: '100', l: 'Core Web Vitals' },
    { icon: <BadgeCheck size={18} />, n: 'AA', l: 'Accessible' },
  ]
  return (
    <section className="stackband"><div className="wrap">
      <Reveal><p className="stack-label">Built with a performance-first scroll stack</p></Reveal>
      <Reveal delay={0.08}><div className="stack-row">{stack.map(s => <span key={s}>{s}</span>)}</div></Reveal>
      <div className="tech-grid">{metrics.map((m, i) => <Reveal key={i} delay={i * 0.08}><div className="tech-metric">{m.icon}<div><b>{m.n}</b><span>{m.l}</span></div></div></Reveal>)}</div>
    </div></section>
  )
}

const RESULTS = [
  { n: '+180%', l: 'Scroll depth increases', tag: 'reads more, bounces less' },
  { n: '2.9×', l: 'Time-on-page lift', tag: 'vs static layouts' },
  { n: '-34%', l: 'Bounce rate drop', tag: 'storytelling sites' },
  { n: '40+', l: 'Pinned scenes shipped', tag: 'global campaigns' },
]
const Results = () => (
  <section className="results" id="results"><div className="wrap">
    <Reveal><SplitWords text="Keep them reading. Then convert." className="sec-title" /></Reveal>
    <p className="sec-sub">A pinned scroll scene isn't decoration — it's retention. Our clients see it in the numbers.</p>
    <div className="results-grid">{RESULTS.map((r, i) => <Reveal key={i} delay={i * 0.08}><div className="result-card"><div className="result-n">{r.n}</div><div className="result-l">{r.l}</div><div className="result-tag">{r.tag}</div></div></Reveal>)}</div>
  </div></section>
)

const SERVICES = [
  { icon: '01', title: 'Product stories', desc: 'Let visitors discover how your product works by scrolling it.', price: 'from €3,900', time: '3-4 wks' },
  { icon: '02', title: 'Campaign timelines', desc: 'A brand story told as scrubbable chapters across one scroll.', price: 'from €4,600', time: '4 wks' },
  { icon: '03', title: 'Editorial narratives', desc: 'Longform features where charts and scenes pin and expand.', price: 'from €3,200', time: '2-3 wks' },
  { icon: '04', title: 'Scroll analytics', desc: 'See exactly where readers stop — and fix the scroll.', price: 'from €1,400', time: '1-2 wks' },
]
const Services = () => (
  <section className="services"><div className="wrap">
    <Reveal><SplitWords text="What we build." className="sec-title" /></Reveal>
    <p className="sec-sub">Fixed scope, fixed price, a delivery date we hit.</p>
    <div className="svc-grid">{SERVICES.map((s, i) => <Reveal key={i} delay={i * 0.08}>
      <motion.div className="service-card" whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}>
        <div className="num">{s.icon}</div><h3>{s.title}</h3><p>{s.desc}</p>
        <div className="svc-meta"><span className="price">{s.price}</span><span className="time"><Clock size={13} /> {s.time}</span></div>
        <a href="#contact" className="svc-link">Start this →</a>
      </motion.div>
    </Reveal>)}</div>
  </div></section>
)

const PLANS = [
  { name: 'Launch', price: '€2,900', for: 'Single scroll scene', feats: ['1 pinned narrative', 'Kinetic reveals', '2 revision rounds', 'SEO + analytics', '2 weeks delivery'] },
  { name: 'Grow', price: '€5,400', for: 'Full narrative site', feats: ['3+ scroll scenes', 'Sticky + parallax', 'Contact / booking', '3 revision rounds', 'Performance report', '30 days support'] },
  { name: 'Scale', price: '€9,200', for: 'Product + analytics', feats: ['Everything in Grow', 'Custom scenes', 'Scroll heatmaps', 'A/B ready', '90 days support'] },
]
const Pricing = () => {
  const [sel, setSel] = useState(1)
  return (
    <section className="pricing" id="pricing"><div className="wrap">
      <Reveal><SplitWords text="Scroll pricing that's clear." className="sec-title" /></Reveal>
      <p className="sec-sub">No hourly billing. A clear scope, a fixed price, a date we sign to.</p>
      <div className="plan-grid">{PLANS.map((p, i) => <Reveal key={i} delay={i * 0.08}>
        <motion.div className={`plan ${i === sel ? 'plan-feat' : ''}`} whileHover={{ y: -6 }} onClick={() => setSel(i)}>
          {i === sel && <span className="plan-pop">Most chosen</span>}
          <h3>{p.name}</h3><div className="plan-price">{p.price}</div><div className="plan-for">{p.for}</div>
          <ul>{p.feats.map((f, k) => <li key={k}><Check size={15} /> {f}</li>)}</ul>
          <motion.a href="#contact" className={i === sel ? 'btn-primary plan-btn' : 'btn-ghost plan-btn'} whileHover={{ scale: 1.04 }}>Choose {p.name}</motion.a>
        </motion.div>
      </Reveal>)}</div>
      <Reveal><div className="guarantee"><Shield size={18} /> Every project ships with a <b>written delivery date</b> and <b>30-day support</b> — we sign to both.</div></Reveal>
    </div></section>
  )
}

const PROCESS = [
  { n: '01', t: 'Storyboard', d: 'We script the scroll — scene by scene — before any code.', icon: <svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { n: '02', t: 'Design', d: 'Visual direction and a scrub-able prototype you approve.', icon: <svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg> },
  { n: '03', t: 'Build', d: 'GSAP + React dev in weekly sprints. You feel it working.', icon: <svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { n: '04', t: 'Measure', d: 'Ship, then read the scroll heatmaps and improve.', icon: <svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
]
const Process = () => (
  <section className="process" id="process"><div className="wrap">
    <Reveal><SplitWords text="Built scene by scene." className="sec-title" /></Reveal>
    <p className="sec-sub">A transparent process with milestones you approve at every step.</p>
    <div className="proc-grid">{PROCESS.map((p, i) => <Reveal key={i} delay={i * 0.08}><motion.div className="proc-step" whileHover={{ y: -6 }}><div className="proc-num">{p.n}<span>{p.icon}</span></div><h4>{p.t}</h4><p>{p.d}</p></motion.div></Reveal>)}</div>
  </div></section>
)

const QUOTES = [
  { q: "Pinned rebuilt our product landing page as a scroll story. Scroll depth +180% and free-trial signups jumped. They delivered on the date.", n: 'Elena M.', r: 'Head of Growth, Nordwind' },
  { q: "The only studio that showed us real scroll analytics after launch — and then made it better. That's the standard.", n: 'Marc D.', r: 'COO, Sail Labs' },
  { q: "A rare team that gets both the craft and the business case. Fixed price, shipped early.", n: 'Sofia P.', r: 'CMO, Aperture' },
]
const Testimonials = () => (
  <section className="quotes"><div className="wrap">
    <Reveal><SplitWords text="Clients who kept reading." className="sec-title" /></Reveal>
    <div className="quotes-grid">{QUOTES.map((q, i) => <Reveal key={i} delay={i * 0.08}><figure className="quote"><div className="stars"><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg><svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg></div><blockquote>{q.q}</blockquote><figcaption><b>{q.n}</b><span>{q.r}</span></figcaption></figure></Reveal>)}</div>
  </div></section>
)

const CTA = () => {
  const [sent, setSent] = useState(false)
  return (
    <section className="cta" id="contact"><div className="wrap cta-inner">
      <Reveal><SplitWords text="Script your scroll with us." className="sec-title" /></Reveal>
      <p className="sec-sub">Tell us your goal and we'll return a scroll script, a fixed quote and a delivery date within one business day.</p>
      {!sent ? <motion.form className="cta-form" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
        <div className="form-row"><input required placeholder="Your name" aria-label="Your name" /><input required type="email" placeholder="Work email" aria-label="Work email" /></div>
        <textarea rows="3" placeholder="Tell us about the scroll story you need" aria-label="Project details" />
        <Magnetic><motion.button whileHover={{ scale: 1.05 }} className="btn-primary" type="submit" style={{ border: 'none', cursor: 'pointer' }}>Send project brief <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></motion.button></Magnetic>
        <p className="form-note"><Shield size={13} /> Free quote · no obligation · reply within 1 business day</p>
      </motion.form> : <motion.div className="cta-done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><BadgeCheck size={44} /><h3>Brief received <svg style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></h3><p>We'll reply within one business day with your scroll script + quote.</p></motion.div>}
      <div className="cta-contact"><span>Prefer email?</span> <a href="mailto:studio@pinned.site">studio@pinned.site</a></div>
    </div></section>
  )
}
const Footer = () => (
  <footer className="site-footer"><div className="wrap foot-inner"><span>© 2026 Pinned — narrative scroll studio.</span><span><a href="#work">Work</a> · <a href="#pricing">Pricing</a> · <a href="mailto:studio@pinned.site">studio@pinned.site</a></span></div></footer>
)

export default function App() {
  useSmoothScroll()
  return (<>
    <Header /><Hero />
    <Stack /><Results /><PinnedScene />
    <Services /><Pricing /><Process /><Testimonials />
    <CTA /><Footer />
  </>)
}
