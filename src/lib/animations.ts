import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Bulletproof, zero-glitch reveal system:
 * - Content is ALWAYS readable and visible by default (no pitch-black void).
 * - Above-the-fold content is instantly visible on page load with zero delay.
 * - Below-the-fold content smoothly glides in using a lightweight native IntersectionObserver.
 * - Completely avoids ScrollTrigger 'undefined reading end' crashes and stale DOM references.
 * - Always clears all inline styles (clearProps: 'all') so fonts and transforms remain 100% crisp.
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

    // Single native observer for below-the-fold items
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            observer.unobserve(target)

            // Graceful hardware-accelerated entrance
            gsap.fromTo(
              target,
              { opacity: 0.35, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
                clearProps: 'all',
              }
            )
          }
        })
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05,
      }
    )

    // Process all reveal targets
    const reveals = container.querySelectorAll<HTMLElement>('[data-reveal]')
    reveals.forEach((el) => {
      if (isAboveFold(el)) {
        // Above the fold: keep visible immediately, clear any lingering styles
        gsap.set(el, { clearProps: 'all' })
      } else {
        // Below the fold: observe for smooth entrance
        observer.observe(el)
      }
    })

    // Process staggered lists
    const staggers = container.querySelectorAll<HTMLElement>('[data-stagger]')
    staggers.forEach((el) => {
      const children = Array.from(el.children) as HTMLElement[]
      if (!children.length) return

      if (isAboveFold(el)) {
        children.forEach((c) => gsap.set(c, { clearProps: 'all' }))
      } else {
        // Observe the parent container and stagger in its items
        const listObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                listObserver.unobserve(entry.target)
                gsap.fromTo(
                  children,
                  { opacity: 0.35, y: 18 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.07,
                    ease: 'power2.out',
                    clearProps: 'all',
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

    // Process image reveals (subtle zoom out without hiding)
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
                  { scale: 1.05 },
                  {
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    clearProps: 'all',
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

    return () => {
      observer.disconnect()
    }
  }, [root, routeKey])
}
