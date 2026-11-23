import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * High-performance editorial scroll reveal system:
 * - Single unified IntersectionObserver routes all reveals (zero observer proliferation)
 * - Above-the-fold content is instantly visible on page load with zero delay
 * - Below-the-fold content glides into place with a subtle, luxury cubic ease-out
 * - Cleans up 100% of observers and active GSAP tweens on unmount to eliminate memory leaks
 * - Clears inline styles (clearProps: 'transform,opacity') so layout remains pristine
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

    // Set of animated elements to clean up on unmount
    const allAnimatedElements: HTMLElement[] = []

    // 1. Text Reveals ([data-reveal])
    const reveals = container.querySelectorAll<HTMLElement>('[data-reveal]')
    reveals.forEach((el) => {
      allAnimatedElements.push(el)
      if (isAboveFold(el)) {
        gsap.set(el, { clearProps: 'all' })
      }
    })

    // 2. Stagger Containers ([data-stagger])
    const staggers = container.querySelectorAll<HTMLElement>('[data-stagger]')
    staggers.forEach((el) => {
      const children = Array.from(el.children) as HTMLElement[]
      children.forEach((c) => allAnimatedElements.push(c))
      if (isAboveFold(el)) {
        children.forEach((c) => gsap.set(c, { clearProps: 'all' }))
      }
    })

    // 3. Image Reveals ([data-img-reveal])
    const imgReveals = container.querySelectorAll<HTMLElement>('[data-img-reveal]')
    imgReveals.forEach((el) => {
      const img = el.querySelector('img')
      if (img) allAnimatedElements.push(img)
      if (isAboveFold(el)) {
        if (img) gsap.set(img, { clearProps: 'all' })
      }
    })

    // 4. Line Reveals ([data-line-reveal])
    const lineReveals = container.querySelectorAll<HTMLElement>('[data-line-reveal]')
    lineReveals.forEach((line) => {
      allAnimatedElements.push(line)
      if (isAboveFold(line)) {
        gsap.set(line, { clearProps: 'all' })
      }
    })

    // Unified observer for all below-the-fold reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          observer.unobserve(target)

          if (target.hasAttribute('data-reveal')) {
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
          } else if (target.hasAttribute('data-stagger')) {
            const children = Array.from(target.children) as HTMLElement[]
            if (children.length) {
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
          } else if (target.hasAttribute('data-img-reveal')) {
            const img = target.querySelector('img')
            if (img) {
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
          } else if (target.hasAttribute('data-line-reveal')) {
            gsap.fromTo(
              target,
              { scaleX: 0, transformOrigin: 'left center' },
              {
                scaleX: 1,
                duration: 0.9,
                ease: 'power3.out',
                clearProps: 'transform',
              }
            )
          }
        })
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
    )

    // Observe only below-the-fold elements
    reveals.forEach((el) => !isAboveFold(el) && observer.observe(el))
    staggers.forEach((el) => !isAboveFold(el) && observer.observe(el))
    imgReveals.forEach((el) => !isAboveFold(el) && observer.observe(el))
    lineReveals.forEach((el) => !isAboveFold(el) && observer.observe(el))

    return () => {
      observer.disconnect()
      allAnimatedElements.forEach((el) => gsap.killTweensOf(el))
    }
  }, [root, routeKey])
}
