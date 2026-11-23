import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../lib/animations'

/**
 * Hero video — resilient multi-browser playback.
 * - preload="metadata": prevents choking initial page load and bandwidth so LCP paints in <1.2s.
 * - Displays high-resolution poster immediately with high fetchPriority.
 * - Full-screen cinematic video with transparent navigation only (strictly no overlays).
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

      {/* Poster — Instant LCP element, high fetchPriority, synchronous decode */}
      <img
        src="/media/poster.jpg"
        alt=""
        fetchPriority="high"
        decoding="sync"
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
          preload="metadata"
          poster="/media/poster.jpg"
          disablePictureInPicture
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
          onError={() => setFailed(true)}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_40%] transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Top subtle scrim for transparent global nav legibility */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/75 to-transparent" />
    </section>
  )
}
