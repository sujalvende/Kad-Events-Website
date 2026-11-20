import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Editorial, minimal, and deeply satisfying scroll reveal system:
 * - Content is ALWAYS accessible and rendered by default (fail-safe).
 * - Above-the-fold content is instantly visible on page load with zero delay.
 * - Below-the-fold content glides into place with a subtle, luxury cubic ease-out.
 * - Staggered lists & grids (services, projects, stats) reveal with an organic cadence.
 * - Images settle from 1.05 to 1.00 for an editorial lens feel.
 * - Accent lines gracefully expand from scaleX: 0 to scaleX: 1.
 * - Always clears all inline styles (clearProps: 'all') so text rendering stays pixel-sharp.
 */
export function useScrollAnimations(root: RefObject<HTMLElement | null>, routeKey: string) {
  useEffect(() => {
    if (reducedMotion() || !root.current) return

    const container = root.current
    const vh = window.innerHeight

    // Elements already visible in current viewport: ensure instant 100% visibility
    const isAboveFold = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      return rect.top < vh * 0.92 && rect.bottom > 0
    }

    // 1. Text & Container Reveals ([data-reveal])
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            observer.unobserve(target)

            gsap.fromTo(
              target,
              { opacity: 0.05, y: 22 },
              {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            )
          }
        })
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
    )

    const reveals = container.querySelectorAll<HTMLElement>('[data-reveal]')
    reveals.forEach((el) => {
      if (isAboveFold(el)) {
        gsap.set(el, { clearProps: 'all' })
      } else {
        observer.observe(el)
      }
    })

    // 2. Cascading Staggered Grids & Lists ([data-stagger])
    const staggers = container.querySelectorAll<HTMLElement>('[data-stagger]')
    staggers.forEach((el) => {
      const children = Array.from(el.children) as HTMLElement[]
      if (!children.length) return

      if (isAboveFold(el)) {
        children.forEach((c) => gsap.set(c, { clearProps: 'all' }))
      } else {
        const listObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                listObserver.unobserve(entry.target)
                gsap.fromTo(
                  children,
                  { opacity: 0.05, y: 24 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                  }
                )
              }
            })
          },
          { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
        )
        listObserver.observe(el)
      }
    })

    // 3. Image Settle Reveals ([data-img-reveal])
    const imgReveals = container.querySelectorAll<HTMLElement>('[data-img-reveal]')
    imgReveals.forEach((el) => {
      const img = el.querySelector('img')
      if (!img) return

      if (isAboveFold(el)) {
        gsap.set(img, { clearProps: 'all' })
      } else {
        const imgObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                imgObserver.unobserve(entry.target)
                gsap.fromTo(
                  img,
                  { scale: 1.06, opacity: 0.85 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    clearProps: 'transform,opacity',
                  }
                )
              }
            })
          },
          { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
        )
        imgObserver.observe(el)
      }
    })

    // 4. Accent Line Expansions ([data-line-reveal])
    const lineReveals = container.querySelectorAll<HTMLElement>('[data-line-reveal]')
    lineReveals.forEach((line) => {
      if (isAboveFold(line)) {
        gsap.set(line, { clearProps: 'all' })
      } else {
        const lineObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              lineObserver.unobserve(entry.target)
              gsap.fromTo(
                entry.target,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                  scaleX: 1,
                  duration: 0.9,
                  ease: 'power3.out',
                  clearProps: 'transform',
                }
              )
            }
          },
          { rootMargin: '0px 0px -20px 0px', threshold: 0.1 }
        )
        lineObserver.observe(line)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [root, routeKey])
}
