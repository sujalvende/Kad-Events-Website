import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './animations'

gsap.registerPlugin(ScrollTrigger)

/** Shared Lenis instance — accessible everywhere for programmatic smooth scrolls */
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
 * Performance Architecture:
 * - autoRaf: false — Lenis is driven strictly by GSAP's central master ticker.
 *   This guarantees zero out-of-phase RAF drift or dual-loop micro-stutter.
 * - gsap.ticker.lagSmoothing(0) — eliminates jumpy catch-up frames during heavy loads.
 * - lerp: 0.1 — crisp, responsive momentum without floaty delay or input lag.
 * - syncTouch: false — preserves 100% native 120Hz ProMotion touch scrolling on mobile.
 * - Only mounts on non-reduced-motion environments.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion()) return
    if (lenisRef.current) return

    const isTouch = window.matchMedia('(pointer: coarse)').matches

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      smoothWheel: !isTouch,
      syncTouch: false,
      infinite: false,
      autoRaf: false, // Unified with GSAP ticker below
    })

    lenisRef.current = lenis
    globalLenis = lenis

    // Keep GSAP ScrollTrigger in lockstep with Lenis scroll offsets
    lenis.on('scroll', ScrollTrigger.update)

    // Master ticker: drive Lenis within GSAP's RAF phase
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
      globalLenis = null
    }
  }, [])
}
