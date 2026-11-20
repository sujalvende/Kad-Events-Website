import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { ArrowUpRight, ShieldCheck, Box, Radio, Crown } from 'lucide-react'
import { reasons, projects, services } from '../data/content'
import { usePageMeta } from '../lib/meta'
import { reducedMotion } from '../lib/animations'
import { TLink } from '../lib/transition'
import Button from '../components/Button'
import Hero from '../components/Hero'
import StageBeams from '../components/StageBeams'
import { CtaBand, Eyebrow, ProjectCard, ServiceCard } from '../components/ui'
import { src } from '../lib/img'

// Lazily import the heavy 3D section — pre-warmed via InteractiveStage
const InteractiveStage = lazy(() => import('../components/InteractiveStage'))

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function SectionHead({
  eyebrow, title, to, cta,
}: {
  eyebrow: string; title: React.ReactNode; to: string; cta: string
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 data-reveal className="display h-lg">{title}</h2>
      </div>
      <TLink
        to={to}
        className="touch-feedback group inline-flex min-h-[36px] items-center gap-2 border-b border-gold/60 pb-1 text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-[0.22em] text-gold transition-all duration-300 hover:text-white hover:border-white self-start md:self-auto"
      >
        <span>{cta}</span>
        <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden />
      </TLink>
    </div>
  )
}

/* ─── Animated Number Counter on Scroll (Direct DOM update - zero React re-renders) ── */
function AnimatedCounter({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          observer.disconnect()

          const match = value.match(/^([\d.]+)(.*)$/)
          if (!match) return
          const targetNum = parseFloat(match[1])
          const suffix = match[2]
          const isDecimal = match[1].includes('.')
          const startTime = performance.now()

          const frame = (now: number) => {
            if (!ref.current) return
            const elapsed = now - startTime
            const progress = Math.min(1, elapsed / duration)
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3)
            const current = targetNum * ease

            if (isDecimal) {
              ref.current.textContent = `${current.toFixed(1)}${suffix}`
            } else {
              ref.current.textContent = `${Math.floor(current)}${suffix}`
            }

            if (progress < 1) {
              requestAnimationFrame(frame)
            } else {
              ref.current.textContent = value
            }
          }
          requestAnimationFrame(frame)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref} className="tabular-nums">{value}</span>
}

/* ─── Stat Band — clean responsive 2x2 grid on mobile ─────────────────── */
function StatBand() {
  const stats = [
    { n: '500+', label: 'Global Productions Delivered', sub: 'Summits, launches & galas' },
    { n: '99.8%', label: 'Flawless Execution Rate', sub: 'Precision timeline management' },
    { n: '150k+', label: 'Executives & Attendees Hosted', sub: 'Across 14 international cities' },
    { n: '10+', label: 'Years of Production Mastery', sub: 'Enterprise & Fortune 500 partner' },
  ]
  return (
    <section aria-label="Key figures" className="relative border-y border-white/10 bg-panel py-2 sm:py-4 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-3/4 rounded-full bg-gold/5 blur-[100px]" />
      <div className="container-x py-6 sm:py-10">
        <ul data-stagger className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <li
              key={s.label}
              className="group relative flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:p-6 lg:p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-gold/40 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
            >
              <span data-reveal className="display text-[1.8rem] sm:text-[2.6rem] leading-none text-white transition-transform duration-500 group-hover:scale-105 lg:text-[4.2rem]">
                <span className="gold-gradient-text font-serif">
                  <AnimatedCounter value={s.n} />
                </span>
              </span>
              <span className="eyebrow mt-2.5 sm:mt-4 text-[0.58rem] sm:text-[0.68rem] text-slate-200 font-bold leading-snug">{s.label}</span>
              <span className="mt-1 text-[0.65rem] sm:text-xs text-muted line-clamp-1 sm:line-clamp-none">{s.sub}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─── Marquee — CSS animation ─────────────────────────────────────────── */
function Marquee() {
  const items = [
    'Global Tech Summits', 'Tier-1 Product Launches', 'Presidential Award Galas',
    '3D Spatial Stage Engineering', 'Brand Experience Activations',
    'Immersive Exhibition Pavilions', 'Satellite Live Broadcasts',
  ]
  const all = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/60 py-3.5 sm:py-4.5 backdrop-blur-md" aria-hidden>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .marquee-track { animation: marquee 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
      `}</style>
      <div className="marquee-track flex whitespace-nowrap" style={{ width: 'max-content' }}>
        {all.map((t, i) => (
          <span key={i} className="mx-5 sm:mx-8 display text-base sm:text-xl font-medium uppercase tracking-[0.18em] text-slate-300">
            {t}
            <span className="mx-5 sm:mx-8 inline-block text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Enterprise Production Pillars ──────────────────────────────────── */
const standards = [
  { icon: Box, n: '01', title: '3D Spatial Scenography', desc: 'Architectural stage design, curved panoramic LED environments, and kinetic lighting rigs tailored for maximum visual command.', tag: 'Stage & Environments' },
  { icon: Radio, n: '02', title: 'Holographic & Multi-Tier AV', desc: 'Ultra-high-density LED walls, spatial acoustic distribution, and real-time generative screen visuals that captivate audiences.', tag: 'Audio Visual & Tech' },
  { icon: ShieldCheck, n: '03', title: 'Precision Timeline Delivery', desc: 'Minute-by-minute show caller execution, backup power redundancy, and seamless technical rehearsals with zero margin for error.', tag: 'Show Operations' },
  { icon: Crown, n: '04', title: 'VIP & Executive Protocols', desc: 'Frictionless red-carpet guest choreography, biometric credentialing, and discreet VIP security handling for high-profile summits.', tag: 'Guest Journey' },
]

/* ─── Home Page ───────────────────────────────────────────────────────── */
export default function Home() {
  usePageMeta(
    '',
    'KAD Events is an international event management company creating world-class corporate summits, product launches, and brand experiences.',
  )

  const imgRef = useRef<HTMLDivElement>(null)
  const secRef = useRef<HTMLElement | null>(null)
  const ticking = useRef(false)

  const onScroll = useCallback(() => {
    if (ticking.current || window.innerWidth < 768) return
    ticking.current = true
    requestAnimationFrame(() => {
      if (imgRef.current) {
        if (!secRef.current) {
          secRef.current = imgRef.current.closest('section')
        }
        const sec = secRef.current
        if (sec) {
          const rect = sec.getBoundingClientRect()
          const progress = -rect.top / (sec.offsetHeight + window.innerHeight)
          imgRef.current.style.transform = `translateY(${progress * 40}px)`
        }
      }
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <>
      {/* 1. Hero — video only */}
      <Hero />

      {/* 2. Marquee ticker */}
      <Marquee />

      {/* 3. Brand Introduction with Volumetric Stage Spotlights */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 bg-ink">
        {/* Theatrical volumetric stage spotlight rays */}
        <StageBeams color="gold" intensity={0.4} direction="up" />

        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-gold/10 blur-[120px] sm:blur-[140px]" />
        <div className="container-x relative z-10 grid items-center gap-10 sm:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>Experiential Production Agency</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Where Global Vision Meets{' '}
              <span className="italic gold-gradient-text font-serif">Monumental Reality.</span>
            </h2>
            <p data-reveal className="mt-5 sm:mt-8 text-base sm:text-lg leading-relaxed text-slate-300">
              KAD Events is an international experiential production firm. We architect
              world-class summits, monumental product reveals, and luxury leadership galas
              for Fortune 500 enterprises, tech innovators, and global organisations.
            </p>
            <p data-reveal className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-muted">
              From creative concept and 3D spatial staging to full technical show calling
              and on-site delivery, our turnkey ownership guarantees an uncompromised experience.
            </p>
            <div data-reveal className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5">
              <Button to="/services" className="w-full sm:w-auto shadow-[0_0_25px_rgba(212,175,55,0.3)]">Our Services</Button>
              <Button to="/about" variant="outline" className="w-full sm:w-auto">About The Agency</Button>
            </div>
          </div>

          <div className="relative lg:col-span-6 will-change-transform" ref={imgRef}>
            <div className="img-mask relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[4/3] sm:aspect-[4/5]">
              <img
                src={src('conference', 1200)}
                alt="Main keynote stage at a global summit"
                data-img-reveal
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="h-full w-full object-cover saturate-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
              {/* Mobile compact badge */}
              <div className="absolute bottom-3 left-3 sm:hidden rounded-lg border border-white/20 bg-black/85 px-3 py-1.5 backdrop-blur-md flex items-center gap-2" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <span className="eyebrow !text-[0.58rem] text-white">Turnkey Production • Tier-1</span>
              </div>
            </div>
            <div
              className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-6 hidden rounded-xl border border-white/15 bg-black/80 p-4 sm:p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] sm:block"
              aria-hidden
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-gold/20 text-gold border border-gold/40">✦</span>
                <div>
                  <p className="eyebrow !text-[0.6rem] text-gold">Corporate Event Mastery</p>
                  <p className="display mt-0.5 text-xl sm:text-2xl text-white">Turnkey Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stat Band with Animated Numbers */}
      <StatBand />

      {/* 5. 3D Event Environment */}
      <section className="relative bg-ink pt-12 sm:pt-20 overflow-x-clip" aria-label="3D event environment">
        <div className="container-x mb-8 sm:mb-10">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Scroll-Driven 3D Storytelling</Eyebrow>
              <h2 data-reveal className="display h-lg text-white">
                The KAD Stage <span className="italic gold-gradient-text font-serif">Evolution.</span>
              </h2>
              <p data-reveal className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                Scroll down to watch the stage atmosphere evolve — from <strong className="text-amber-400">Royal Gala</strong> to{' '}
                <strong className="text-cyan-400">Cyber Summit</strong> and into{' '}
                <strong className="text-fuchsia-400">Keynote Launch</strong> — with live volumetric lighting and procedural LED graphics.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="eyebrow text-gold">3-Phase Production Flow</span>
              <p className="mt-1 text-xs text-muted">Royal Gala → Cyber Summit → Keynote Launch</p>
            </div>
          </div>
        </div>
        <Suspense fallback={<div className="h-[230vh] sm:h-[260vh] w-full bg-ink" />}>
          <InteractiveStage />
        </Suspense>
      </section>

      {/* 6. Production Standard Grid */}
      <section className="section-y border-t border-white/10 bg-panel relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-[140px]" />
        <div className="container-x">
          <SectionHead
            eyebrow="Production Capabilities"
            title={<>Engineered for <span className="italic gold-gradient-text font-serif">Zero Compromise.</span></>}
            to="/process"
            cta="How We Deliver"
          />
          <div
            data-stagger
            className="mt-8 sm:mt-16 flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 gap-3.5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5"
          >
            {standards.map((st) => {
              const Icon = st.icon
              return (
                <div
                  key={st.n}
                  className="w-[82vw] xs:w-[70vw] sm:w-auto shrink-0 snap-center group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 md:p-8 backdrop-blur-sm transition-all duration-300 active:scale-[0.98] hover:border-gold/60 hover:bg-white/[0.04] hover:shadow-[0_10px_35px_-5px_rgba(212,175,55,0.2)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="eyebrow text-gold">{st.n}</span>
                      <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-gold group-hover:border-gold/40 group-hover:bg-gold/10 transition-colors">
                        <Icon size={17} />
                      </span>
                    </div>
                    <h3 className="display mt-4 sm:mt-6 text-xl sm:text-2xl text-white group-hover:text-gold transition-colors">{st.title}</h3>
                    <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted">{st.desc}</p>
                  </div>
                  <div className="mt-6 sm:mt-8 border-t border-white/10 pt-3 sm:pt-4 flex items-center justify-between text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <span>{st.tag}</span>
                    <span className="text-gold/40 text-xs sm:hidden">✦</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile swipe hint */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 sm:hidden" aria-hidden>
            <span className="text-[0.58rem] font-semibold uppercase tracking-widest text-slate-400">Swipe to inspect all capabilities</span>
            <span className="text-gold text-xs">→</span>
          </div>
        </div>
      </section>

      {/* 7. Services Overview */}
      <section className="section-y bg-ink border-t border-white/10 relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold/10 blur-[140px]" />
        <div className="container-x">
          <SectionHead
            eyebrow="Specialised Formats"
            title={<>What we <span className="italic gold-gradient-text font-serif">deliver.</span></>}
            to="/services"
            cta="All Services"
          />
          <div data-stagger className="mt-8 sm:mt-12 grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((s, i) => (
              <ServiceCard key={s.slug} s={s} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Featured Projects */}
      <section className="section-y border-t border-white/10 bg-panel overflow-hidden">
        <div className="container-x">
          <SectionHead
            eyebrow="Selected Portfolio"
            title={<>Featured <span className="italic gold-gradient-text font-serif">productions.</span></>}
            to="/work"
            cta="Explore All Work"
          />
          <div className="mt-10 sm:mt-14 grid gap-4 sm:gap-6 md:grid-cols-12">
            <ProjectCard p={projects[0]} className="md:col-span-7" />
            <ProjectCard p={projects[1]} className="md:col-span-5" ratio="aspect-[4/3] md:aspect-auto md:h-full" />
            <ProjectCard p={projects[2]} className="md:col-span-5" ratio="aspect-[4/3] md:aspect-auto md:h-full" />
            <ProjectCard p={projects[3]} className="md:col-span-7" />
          </div>
        </div>
      </section>

      {/* 9. Why KAD Events with Theatrical Atmosphere */}
      <section className="section-y border-t border-white/10 bg-ink relative overflow-hidden">
        {/* Subtle theatrical stage spotlight beams */}
        <StageBeams color="gold" intensity={0.3} direction="up" />

        <div className="container-x relative z-10 grid gap-10 sm:gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>The KAD Advantage</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Why top enterprises{' '}
              <span className="italic gold-gradient-text font-serif">choose us.</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
              When your brand's reputation is on stage, there is no room for trial and error.
              We provide the calm, authoritative execution leadership you need to succeed.
            </p>
            <div className="mt-6 sm:mt-8">
              <Button to="/contact" className="w-full sm:w-auto shadow-[0_0_20px_rgba(212,175,55,0.25)]">Start A Conversation</Button>
            </div>
          </div>
          <ul data-stagger className="lg:col-span-7">
            {reasons.map((r, i) => (
              <li
                key={r.title}
                className="group grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr] items-baseline gap-3 sm:gap-4 border-t border-white/10 py-5 sm:py-7 last:border-b transition-all duration-300 hover:border-gold/40 md:grid-cols-[3.5rem_1fr_1fr]"
              >
                <span className="eyebrow text-gold font-bold text-[0.65rem] sm:text-xs">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display mt-1 sm:mt-2 text-xl sm:text-2xl text-white transition-all duration-500 group-hover:translate-x-1 sm:group-hover:translate-x-2 group-hover:text-gold md:text-4xl">{r.title}</h3>
                <p className="col-start-2 text-xs sm:text-sm text-slate-300 leading-relaxed md:col-start-auto mt-1 sm:mt-0">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10. Editorial atmosphere strip */}
      <section className="relative h-[40vh] sm:h-[60vh] min-h-[300px] sm:min-h-[420px] overflow-hidden" aria-hidden>
        <img
          src={src('crowd', 1600)}
          alt=""
          loading="lazy"
          decoding="async"
          width={1600}
          height={900}
          className="h-full w-full object-cover opacity-45 saturate-125"
          style={{ objectPosition: '50% 35%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </section>

      {/* 11. CTA with sweeping theatrical spotlight beams */}
      <CtaBand />
    </>
  )
}
