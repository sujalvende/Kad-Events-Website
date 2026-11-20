import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../lib/animations'

/**
 * Hero video — resilient multi-browser playback.
 * - Set defaultMuted & muted before play() to pass iOS Safari & Chrome autoplay policies.
 * - Displays high-resolution poster immediately; smoothly reveals video once frames are ready.
 * - Pauses automatically when off-screen to preserve mobile GPU/battery.
 */
export default function Hero() {
  const ref = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  // Initial play attempt with multi-browser compliance
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (reducedMotion()) {
      v.pause()
      return
    }
    // Safari requirement: defaultMuted MUST be set before play()
    v.defaultMuted = true
    v.muted = true
    const p = v.play()
    if (p !== undefined) {
      p.then(() => setReady(true)).catch(() => {
        // Autoplay policy: poster remains visible underneath
      })
    }
  }, [])

  // Pause video when section scrolls off-screen, resume when back in view
  useEffect(() => {
    const section = sectionRef.current
    const v = ref.current
    if (!section || !v || reducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="KAD Events showreel"
      className="relative h-[100svh] min-h-[480px] w-full overflow-hidden bg-ink"
    >
      <h1 className="sr-only">KAD Events: corporate event management</h1>

      {/* Poster — always shown underneath, seamless transition once video frames render */}
      <img
        src="/media/poster.jpg"
        alt=""
        fetchPriority="high"
        width={1280}
        height={720}
        className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
      />

      {!failed && (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/poster.jpg"
          disablePictureInPicture
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
          onError={() => setFailed(true)}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_40%] transition-opacity duration-1000 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Top scrim for nav legibility */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/75 to-transparent" />

      {/* Bottom scrim for mobile contrast & text legibility */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink via-ink/60 to-transparent md:hidden" />

      {/* Luxury frosted glass scroll cue on mobile */}
      <div
        className="pointer-events-none absolute bottom-[max(2rem,env(safe-area-inset-bottom))] inset-x-0 z-20 flex flex-col items-center gap-2 md:hidden"
        aria-hidden
      >
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          <span className="eyebrow !text-[0.58rem] tracking-[0.24em] text-slate-200">
            Scroll to explore
          </span>
        </div>
        <div className="h-6 w-3.5 rounded-full border border-white/25 p-0.5 flex justify-center">
          <div className="h-1.5 w-1 rounded-full bg-gradient-to-b from-gold to-amber-200 animate-bounce shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </div>
      </div>
    </section>
  )
}
