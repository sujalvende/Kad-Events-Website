import { useEffect, useRef, useState } from 'react'

interface Props {
  onComplete: () => void
}

/**
 * Cinematic KAD Events intro loader.
 * - Preloads the hero video metadata so it's ready to play instantly.
 * - Shows animated logo reveal + progress bar.
 * - Calls onComplete() once minimum display time AND video metadata are ready.
 */
export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'counting' | 'done'>('counting')
  const [exiting, setExiting] = useState(false)
  const startRef = useRef(Date.now())
  const MIN_MS = 2200 // minimum screen time so the intro can breathe
  const doneRef = useRef(false)

  // Animate progress bar smoothly from 0 → 100
  useEffect(() => {
    let raf: number
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      // Ease-out curve: fast at first, slow at the end
      const raw = Math.min(elapsed / MIN_MS, 1)
      const eased = 1 - Math.pow(1 - raw, 3)
      setProgress(Math.round(eased * 100))
      if (raw < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Preload hero video metadata
  useEffect(() => {
    // Fire-and-forget: warm the ThreeDStage chunk while user watches the loading screen
    import('../components/ThreeDStage').catch(() => {})

    const tryComplete = () => {
      if (doneRef.current) return
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, MIN_MS - elapsed)
      setTimeout(() => {
        if (doneRef.current) return
        doneRef.current = true
        setPhase('done')
        setProgress(100)
        // Short pause at 100% before exiting
        setTimeout(() => {
          setExiting(true)
          setTimeout(onComplete, 850) // wait for exit animation
        }, 300)
      }, remaining)
    }

    // Preload video
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = tryComplete
    video.onerror = tryComplete
    video.src = '/media/hero.mp4'

    // Fallback: complete after min time even if video fails to load metadata
    const fallback = setTimeout(tryComplete, MIN_MS + 400)

    return () => {
      clearTimeout(fallback)
      video.src = ''
    }
  }, [onComplete])

  return (
    <div
      aria-label="Loading KAD Events"
      role="progressbar"
      aria-valuenow={progress}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060608] transition-all duration-700 ease-in-out ${
        exiting ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Noise texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(212,175,55,0.12) 0%, transparent 70%)',
          transition: 'opacity 0.6s',
          opacity: phase === 'done' ? 0 : 1,
        }}
      />

      {/* Animated corner brackets */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <div key={pos} aria-hidden className={`absolute ${pos} h-10 w-10`}>
          <div
            className="absolute top-0 left-0 h-5 w-px bg-gold/60"
            style={{ animation: `fadeIn 0.4s ${i * 0.1}s both` }}
          />
          <div
            className="absolute top-0 left-0 h-px w-5 bg-gold/60"
            style={{ animation: `fadeIn 0.4s ${i * 0.1}s both` }}
          />
          <div
            className="absolute bottom-0 right-0 h-5 w-px bg-gold/60"
            style={{ animation: `fadeIn 0.4s ${i * 0.1}s both` }}
          />
          <div
            className="absolute bottom-0 right-0 h-px w-5 bg-gold/60"
            style={{ animation: `fadeIn 0.4s ${i * 0.1}s both` }}
          />
        </div>
      ))}

      {/* Core content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
        {/* Logo mark */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: 'slideUp 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          {/* Top rule */}
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* KAD wordmark */}
          <div className="relative">
            <span
              className="block font-display text-[4.5rem] font-medium leading-none tracking-[-0.02em] text-white md:text-[6rem]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              KAD
            </span>
            {/* Gold shimmer sweep */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(105deg, transparent 20%, rgba(212,175,55,0.35) 50%, transparent 80%)',
                animation: 'shimmer 2.2s 0.5s infinite',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          <span
            className="block text-[0.6rem] font-semibold uppercase tracking-[0.55em] text-gold"
          >
            Events
          </span>

          {/* Bottom rule */}
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Tagline */}
        <p
          className="text-[0.68rem] font-medium uppercase tracking-[0.4em] text-slate-400"
          style={{ animation: 'slideUp 0.7s 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          Crafting Extraordinary Experiences
        </p>

        {/* Progress block */}
        <div
          className="flex w-64 flex-col items-center gap-3"
          style={{ animation: 'slideUp 0.7s 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          {/* Progress track */}
          <div className="relative h-px w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/70 via-gold to-amber-200 transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Moving glow dot */}
            <div
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_8px_3px_rgba(212,175,55,0.8)] transition-[left] duration-150 ease-out"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Counter */}
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-medium text-white tabular-nums" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              {progress}
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-gold/70">%</span>
          </div>

          {/* Status text */}
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-slate-500">
            {progress < 40
              ? 'Initialising Stage Environment'
              : progress < 75
              ? 'Loading Production Assets'
              : progress < 95
              ? 'Preparing Your Experience'
              : 'Ready'}
          </p>
        </div>
      </div>

      {/* Bottom credit line */}
      <div
        className="absolute bottom-6 inset-x-0 flex justify-center"
        style={{ animation: 'fadeIn 0.6s 0.8s both' }}
      >
        <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white/20">
          Premium Corporate Event Management
        </span>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  )
}
