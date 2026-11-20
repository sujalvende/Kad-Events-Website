import { lazy, Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Zap, Flame, ChevronDown } from 'lucide-react'
import { reducedMotion } from '../lib/animations'
import { globalLenis } from '../lib/lenis'
import type { StageMood } from './ThreeDStage'
import { src } from '../lib/img'

// Trigger chunk preload immediately when InteractiveStage.tsx is imported
const _preload = import('./ThreeDStage').catch(() => {})

// Lazy-load the heavy 3D scene — pre-warmed in background
const ThreeDStage = lazy(() => import('./ThreeDStage'))

/** Check WebGL capability — enable on both mobile and desktop */
function canRender3D(): boolean {
  if (typeof window === 'undefined') return false
  if (reducedMotion()) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    return !!gl
  } catch {
    return false
  }
}

export default function InteractiveStage() {
  const [mood, setMood] = useState<StageMood>('gala')
  const [scrollProgress, setScrollProgress] = useState(0)

  // PRE-WARMING: mount in background so shaders are compiled before user scrolls here.
  // Because paused={!isOnScreen}, frameloop is 'never', consuming 0% continuous GPU.
  const [hasMounted, setHasMounted] = useState(false)
  const [isOnScreen, setIsOnScreen] = useState(false)
  const [render3D] = useState(() => canRender3D())
  const trackRef = useRef<HTMLDivElement>(null)
  const moodRef = useRef<StageMood>('gala')

  const presets: {
    id: StageMood
    label: string
    shortLabel: string
    icon: typeof Sparkles
    colorClass: string
    borderClass: string
    desc: string
    photo: 'vipGala' | 'conference' | 'productReveal'
  }[] = [
    {
      id: 'gala', label: 'Royal Gala', shortLabel: 'Gala', icon: Sparkles,
      colorClass: 'text-amber-400 bg-amber-400/10',
      borderClass: 'border-amber-400/50 shadow-[0_0_25px_rgba(212,175,55,0.35)]',
      desc: 'Phase 01 // Luxury Gold Scenography',
      photo: 'vipGala',
    },
    {
      id: 'summit', label: 'Cyber Summit', shortLabel: 'Summit', icon: Zap,
      colorClass: 'text-cyan-400 bg-cyan-400/10',
      borderClass: 'border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.35)]',
      desc: 'Phase 02 // Enterprise Cyber Tech Matrix',
      photo: 'conference',
    },
    {
      id: 'launch', label: 'Keynote Launch', shortLabel: 'Launch', icon: Flame,
      colorClass: 'text-fuchsia-400 bg-fuchsia-400/10',
      borderClass: 'border-fuchsia-400/50 shadow-[0_0_25px_rgba(217,70,239,0.35)]',
      desc: 'Phase 03 // World Premiere Reveal',
      photo: 'productReveal',
    },
  ]

  // Pre-warm the 3D stage 300ms after page mount, or immediately when scrolled near
  useEffect(() => {
    if (hasMounted) return
    // Early background warm-up timer
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, 350)

    // Also observe intersection as fallback
    const el = trackRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasMounted(true)
          setIsOnScreen(true)
          observer.disconnect()
        }
      },
      { rootMargin: '800px 0px' }
    )
    observer.observe(el)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [hasMounted])

  // Track real-time visibility to pause/resume 3D rendering
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { rootMargin: '200px 0px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Native scroll handler
  const handleScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const totalHeight = el.offsetHeight - window.innerHeight
    if (totalHeight <= 0) return

    const scrolled = -rect.top
    const p = Math.max(0, Math.min(1, scrolled / totalHeight))
    setScrollProgress(p)

    const newMood: StageMood = p < 0.33 ? 'gala' : p < 0.68 ? 'summit' : 'launch'
    if (newMood !== moodRef.current) {
      moodRef.current = newMood
      setMood(newMood)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    const unbind = globalLenis?.on('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      unbind?.()
    }
  }, [handleScroll])

  const jumpToPhase = (id: StageMood) => {
    setMood(id)
    moodRef.current = id
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top
    const totalDist = trackRef.current.offsetHeight - window.innerHeight
    const targetY =
      id === 'gala'
        ? scrollTop + 20
        : id === 'summit'
        ? scrollTop + totalDist * 0.48
        : scrollTop + totalDist * 0.88

    if (globalLenis) {
      globalLenis.scrollTo(targetY, { duration: 1.2 })
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    }
  }

  const currentTheme = presets.find((p) => p.id === mood) || presets[0]

  // Rich fallback for no-WebGL / reduced-motion environments
  if (!render3D) {
    return (
      <div className="relative min-h-[600px] overflow-hidden bg-panel border-y border-white/10 py-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-1000"
          style={{ backgroundImage: `url(${src(currentTheme.photo, 1400)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/60" />

        <div className="relative z-10 container-x flex flex-col items-center text-center">
          <div className="mb-8 flex items-center gap-2 rounded-full border border-white/20 bg-black/80 p-1.5 backdrop-blur-xl">
            {presets.map((p) => {
              const Icon = p.icon
              const active = mood === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setMood(p.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-[0.6rem] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    active ? `border ${p.borderClass} ${p.colorClass} text-white` : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>

          <p className="eyebrow text-gold mb-3">{currentTheme.desc}</p>
          <h3 className="display h-lg text-white max-w-2xl">
            Interactive Stage <span className="italic gold-gradient-text font-serif">Architecture.</span>
          </h3>
          <p className="mt-4 max-w-md text-sm text-slate-300 leading-relaxed">
            Multi-tiered kinetic lighting, spatial LED monoliths, and precision audio visual staging engineered for global corporate summits.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={trackRef} className="relative h-[230vh] sm:h-[260vh]">
      {/* Sticky Fullscreen 3D Stage Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        {/* Atmospheric radial backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-all duration-1000"
          style={{
            background:
              mood === 'gala'
                ? 'radial-gradient(ellipse 70% 60% at 50% 65%, rgba(212,175,55,0.18) 0%, rgba(245,158,11,0.06) 45%, transparent 75%)'
                : mood === 'summit'
                ? 'radial-gradient(ellipse 70% 60% at 50% 65%, rgba(0,240,255,0.16) 0%, rgba(59,130,246,0.06) 45%, transparent 75%)'
                : 'radial-gradient(ellipse 70% 60% at 50% 65%, rgba(217,70,239,0.18) 0%, rgba(139,92,246,0.06) 45%, transparent 75%)',
          }}
        />

        {/* Top Controls — positioned below navbar on mobile and desktop */}
        <div className="pointer-events-auto absolute inset-x-0 top-16 sm:top-20 z-20 flex flex-col items-center justify-between gap-2.5 px-3 sm:px-6 md:flex-row md:px-12">
          {/* Phase Badge */}
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  mood === 'gala' ? 'bg-amber-400' : mood === 'summit' ? 'bg-cyan-400' : 'bg-fuchsia-400'
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  mood === 'gala' ? 'bg-amber-400' : mood === 'summit' ? 'bg-cyan-400' : 'bg-fuchsia-400'
                }`}
              />
            </span>
            <span className="eyebrow !text-[0.58rem] sm:!text-[0.65rem] text-white tracking-wider">{currentTheme.desc}</span>
          </div>

          {/* Phase Switcher Tabs — mobile optimized padding & typography */}
          <div className="relative flex items-center gap-1 rounded-full border border-white/20 bg-black/85 p-1 sm:p-1.5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {presets.map((p) => {
              const Icon = p.icon
              const active = mood === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => jumpToPhase(p.id)}
                  aria-label={`Switch to ${p.label}`}
                  className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-wider sm:tracking-[0.2em] transition-all duration-300 ${
                    active
                      ? `border ${p.borderClass} ${p.colorClass} text-white`
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={12} className={`shrink-0 transition-transform duration-300 sm:w-3.5 sm:h-3.5 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden xs:inline sm:inline">{p.label}</span>
                  <span className="xs:hidden sm:hidden">{p.shortLabel}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3D Canvas — pre-warmed so it appears instantly with zero delay */}
        {hasMounted && (
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-ink">
              <div className="flex flex-col items-center gap-3">
                <div className="h-0.5 w-28 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-gold" />
                </div>
                <span className="eyebrow !text-[0.58rem] text-gold/80">Loading Stage</span>
              </div>
            </div>
          }>
            <ThreeDStage mood={mood} scrollProgress={scrollProgress} paused={!isOnScreen} />
          </Suspense>
        )}

        {/* Scroll progress bar + cue */}
        <div className="pointer-events-none absolute bottom-6 sm:bottom-8 inset-x-0 z-20 flex flex-col items-center gap-2">
          <div className="h-1 w-28 sm:w-36 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                mood === 'gala'
                  ? 'bg-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.8)]'
                  : mood === 'summit'
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]'
                  : 'bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.8)]'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, scrollProgress * 100))}%` }}
            />
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[0.58rem] sm:text-[0.62rem] uppercase tracking-widest text-slate-300 backdrop-blur-md">
            <span>Scroll to Evolve Theme</span>
            <ChevronDown size={11} className="text-gold animate-bounce" />
          </span>
        </div>

        {/* Floor fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 sm:h-32"
          style={{ background: 'linear-gradient(to top, #060608 0%, transparent 100%)' }}
        />
      </div>
    </div>
  )
}
