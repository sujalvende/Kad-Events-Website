import { lazy, Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { reducedMotion } from '../lib/animations'
import { globalLenis } from '../lib/lenis'
import type { StageMood } from './ThreeDStage'
import { src } from '../lib/img'

// Trigger chunk preload immediately when InteractiveStage.tsx is imported
import('./ThreeDStage').catch(() => {})

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
  const scrollProgressRef = useRef(0)

  // PRE-WARMING: mount in background so shaders are compiled before user scrolls here.
  // Because paused={!isOnScreen}, frameloop is 'never', consuming 0% continuous GPU.
  const [hasMounted, setHasMounted] = useState(false)
  const [isOnScreen, setIsOnScreen] = useState(false)
  const [render3D] = useState(() => canRender3D())
  const trackRef = useRef<HTMLDivElement>(null)
  const moodRef = useRef<StageMood>('gala')
  const progressBarRef = useRef<HTMLDivElement>(null)

  const presets = [
    {
      id: 'gala' as StageMood,
      phase: '01',
      label: 'Royal Gala',
      shortLabel: 'Gala',
      subtitle: 'Luxury Gold Scenography',
      accentColor: '#d4af37',
      glow: 'rgba(212, 175, 55, 0.4)',
      photo: 'vipGala' as const,
    },
    {
      id: 'summit' as StageMood,
      phase: '02',
      label: 'Cyber Summit',
      shortLabel: 'Summit',
      subtitle: 'Enterprise Tech Matrix',
      accentColor: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.4)',
      photo: 'conference' as const,
    },
    {
      id: 'launch' as StageMood,
      phase: '03',
      label: 'Keynote Launch',
      shortLabel: 'Launch',
      subtitle: 'World Premiere Reveal',
      accentColor: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.4)',
      photo: 'productReveal' as const,
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
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(el)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [hasMounted])

  // Track real-time visibility to pause/resume 3D rendering — only runs when actually on-screen
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { rootMargin: '40px 0px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Throttled native scroll handler — only calculates when visible on screen
  const tickingRef = useRef(false)
  const handleScroll = useCallback(() => {
    const el = trackRef.current
    if (!el || !isOnScreen) return
    if (tickingRef.current) return
    tickingRef.current = true

    requestAnimationFrame(() => {
      if (!trackRef.current) {
        tickingRef.current = false
        return
      }
      const rect = trackRef.current.getBoundingClientRect()
      const totalHeight = trackRef.current.offsetHeight - window.innerHeight
      if (totalHeight > 0) {
        const scrolled = -rect.top
        const p = Math.max(0, Math.min(1, scrolled / totalHeight))
        scrollProgressRef.current = p

        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${p})`
        }

        const newMood: StageMood = p < 0.33 ? 'gala' : p < 0.68 ? 'summit' : 'launch'
        if (newMood !== moodRef.current) {
          moodRef.current = newMood
          setMood(newMood)
        }
      }
      tickingRef.current = false
    })
  }, [isOnScreen])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
          <div className="mb-8 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#07080c]/85 p-1.5 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {presets.map((p) => {
              const active = mood === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setMood(p.id)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[0.62rem] sm:text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                    active ? 'text-white bg-white/[0.08] shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-slate-400 hover:text-white'
                  }`}
                  style={active ? { borderColor: p.accentColor } : undefined}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: p.accentColor }}
                  />
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>

          <p className="eyebrow text-gold mb-3">STAGE {currentTheme.phase} • {currentTheme.subtitle}</p>
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

        {/* Top Controls — Architectural Scenography Console */}
        <div className="pointer-events-auto absolute inset-x-0 top-14 sm:top-20 z-20 flex flex-col items-center justify-between gap-3 px-4 sm:px-8 md:flex-row md:px-14">
          {/* Phase Badge — Architectural Stage Plaque */}
          <div className="flex items-center gap-3.5 rounded-full border border-white/[0.12] bg-[#06070a]/90 px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]">
            {/* Optic Iris Jewel Lens */}
            <div className="relative flex items-center justify-center">
              <span
                className="absolute h-4 w-4 rounded-full opacity-60 transition-all duration-500"
                style={{
                  backgroundColor: currentTheme.accentColor,
                  filter: 'blur(4px)',
                }}
              />
              <span
                className="relative h-2.5 w-2.5 rounded-full border border-white/30 transition-all duration-500"
                style={{
                  background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${currentTheme.accentColor} 65%)`,
                  boxShadow: `0 0 10px ${currentTheme.accentColor}`,
                }}
              />
            </div>

            {/* Typography & Mode Metadata */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.62rem] sm:text-[0.66rem] font-bold tracking-[0.2em] text-gold uppercase tabular-nums">
                PHASE {currentTheme.phase}
              </span>
              <span className="h-3 w-px bg-white/20" aria-hidden="true" />
              <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-white">
                {currentTheme.label}
              </span>
              <span className="hidden sm:inline text-white/30 text-[0.65rem] font-light">·</span>
              <span className="hidden sm:inline text-[0.62rem] sm:text-[0.66rem] tracking-[0.14em] uppercase text-slate-400">
                {currentTheme.subtitle}
              </span>
            </div>
          </div>

          {/* Phase Switcher Tabs — Segmented Architectural Deck */}
          <nav
            aria-label="3D Scenography Presets"
            className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-white/[0.12] bg-[#06070a]/90 p-1 sm:p-1.5 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            {presets.map((p) => {
              const active = mood === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => jumpToPhase(p.id)}
                  aria-label={`Switch to ${p.label}`}
                  className={`touch-feedback group relative flex min-h-[36px] sm:min-h-[40px] items-center gap-2 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.16em] active:scale-[0.97] transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-out ${
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.09)',
                          boxShadow: `0 0 20px ${p.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
                          border: `1px solid ${p.accentColor}66`,
                        }
                      : { border: '1px solid transparent' }
                  }
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: active ? p.accentColor : 'rgba(255, 255, 255, 0.25)',
                      boxShadow: active ? `0 0 8px ${p.accentColor}` : 'none',
                    }}
                  />
                  <span className="tabular-nums font-mono text-[0.6rem] opacity-60">0{p.phase}</span>
                  <span className="hidden xs:inline sm:inline">{p.shortLabel}</span>
                  <span className="xs:hidden sm:hidden">{p.shortLabel}</span>
                </button>
              )
            })}
          </nav>
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
            <ThreeDStage mood={mood} scrollProgressRef={scrollProgressRef} paused={!isOnScreen} />
          </Suspense>
        )}

        {/* Scroll progress bar + cue */}
        <div className="pointer-events-none absolute bottom-6 sm:bottom-8 inset-x-0 z-20 flex flex-col items-center gap-2.5">
          <div className="h-0.5 w-28 sm:w-36 rounded-full bg-white/10 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left transition-colors duration-500"
              style={{
                transform: 'scaleX(0.05)',
                backgroundColor: currentTheme.accentColor,
                boxShadow: `0 0 12px ${currentTheme.accentColor}`,
              }}
            />
          </div>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-[#07080c]/85 px-3.5 py-1 text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.2em] font-medium text-slate-300 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.6)]">
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
