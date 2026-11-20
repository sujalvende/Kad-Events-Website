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

      {/* Bottom scroll cue on mobile so visitors immediately know to scroll */}
      <div className="pointer-events-none absolute bottom-8 inset-x-0 z-20 flex flex-col items-center gap-2 md:hidden">
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-slate-300 drop-shadow-md">
          Scroll to explore
        </span>
        <div className="h-7 w-4 rounded-full border border-white/30 p-1 flex justify-center">
          <div className="h-1.5 w-1 rounded-full bg-gold animate-bounce" />
        </div>
      </div>
    </section>
  )
}
