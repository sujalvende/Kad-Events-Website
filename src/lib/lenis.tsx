import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './animations'

gsap.registerPlugin(ScrollTrigger)

/** Shared Lenis instance — accessible everywhere for scrollToTop() */
export let globalLenis: Lenis | null = null

/** Instantly scroll to the top of the page (used on route change) */
export function scrollToTop() {
  if (typeof window === 'undefined') return
  if (globalLenis) {
    globalLenis.scrollTo(0, { immediate: true, force: true })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
}

/**
 * Mounts the global Lenis smooth scroll instance.
 *
 * Key design decisions:
 * - Called ONCE from Layout (outer component that never unmounts) so Lenis
 *   is never destroyed/recreated on page navigation.
 * - lerp: 0.075 — silky smooth momentum without feeling laggy.
 * - duration: 1.4 — natural deceleration curve.
 * - easing: exponential ease-out — premium feel used by high-end creative sites.
 * - syncTouch: false — uses native momentum on touch, only smooths wheel.
 * - Wired to GSAP ticker so ScrollTrigger stays in sync.
 * - Respects prefers-reduced-motion by not mounting at all.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion()) return

    // Guard: only one Lenis instance across the app lifetime
    if (lenisRef.current) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      smoothWheel: true,
      syncTouch: false,         // native momentum on mobile, smooth on desktop
      touchMultiplier: 2,
      infinite: false,
      autoRaf: false,           // we drive raf manually via GSAP ticker
    })

    lenisRef.current = lenis
    globalLenis = lenis

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis via GSAP's ticker for perfect frame sync
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0) // prevent large jumps after tab switch

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
      globalLenis = null
    }
  }, [])
}
