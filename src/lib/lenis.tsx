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
      lerp: 0.09,               // Silky smooth momentum without floaty lag
      wheelMultiplier: 1.0,     // 1:1 natural wheel & trackpad response
      smoothWheel: true,
      syncTouch: false,         // Native touch momentum on mobile, smooth on desktop
      infinite: false,
      autoRaf: true,            // Direct native RAF loop bound to display refresh rate
    })

    lenisRef.current = lenis
    globalLenis = lenis

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    return () => {
      lenis.destroy()
      lenisRef.current = null
      globalLenis = null
    }
  }, [])
}
