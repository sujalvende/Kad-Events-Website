import { useEffect, useRef } from 'react'
import { finePointer, reducedMotion } from '../lib/animations'

/**
 * Luxury minimal ring cursor:
 * - Position uses GPU translate3d(...) in RAF — zero layout thrashing while moving
 * - Dimension transitions (22px normal -> 52px interactive -> 80px view) smoothly via CSS
 * - The "VIEW" label is delicately proportioned (10px, uppercase, tracking + textIndent optical center)
 * - Disabled on touch/mobile devices
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!finePointer() || reducedMotion() || !ring.current) return

    const el = ring.current
    const labelEl = label.current

    let targetX = -200, targetY = -200
    let currentX = -200, currentY = -200
    let currentMode: 'normal' | 'interactive' | 'view' = 'normal'
    let visible = false
    let rafId: number

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      rafId = requestAnimationFrame(tick)

      currentX = lerp(currentX, targetX, 0.22)
      currentY = lerp(currentY, targetY, 0.22)

      if (visible) {
        // Pure compositor transform — zero layout or paint during mouse move
        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
        if (el.style.opacity !== '1') el.style.opacity = '1'
      }
    }

    rafId = requestAnimationFrame(tick)

    let lastCheck = 0
    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        currentX = e.clientX
        currentY = e.clientY
        visible = true
      }

      // Check hover target at 30fps to keep main-thread free
      const now = performance.now()
      if (now - lastCheck > 32) {
        lastCheck = now
        const t = (e.target as HTMLElement).closest?.('[data-cursor],a,button,select,summary')
        const isView = t?.getAttribute('data-cursor') === 'view'
        const isInteractive = !!t

        const newMode: 'normal' | 'interactive' | 'view' = isView
          ? 'view'
          : isInteractive
          ? 'interactive'
          : 'normal'

        if (newMode !== currentMode) {
          currentMode = newMode
          if (newMode === 'view') {
            el.style.width = '80px'
            el.style.height = '80px'
            el.style.backgroundColor = '#d4af37'
            el.style.borderColor = '#d4af37'
            el.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.35)'
            if (labelEl) {
              labelEl.style.opacity = '1'
              labelEl.style.transitionDelay = '60ms'
            }
          } else if (newMode === 'interactive') {
            el.style.width = '52px'
            el.style.height = '52px'
            el.style.backgroundColor = 'rgba(212, 175, 55, 0.14)'
            el.style.borderColor = 'rgba(212, 175, 55, 0.8)'
            el.style.boxShadow = 'none'
            if (labelEl) {
              labelEl.style.opacity = '0'
              labelEl.style.transitionDelay = '0ms'
            }
          } else {
            el.style.width = '22px'
            el.style.height = '22px'
            el.style.backgroundColor = 'transparent'
            el.style.borderColor = '#d4af37'
            el.style.boxShadow = 'none'
            if (labelEl) {
              labelEl.style.opacity = '0'
              labelEl.style.transitionDelay = '0ms'
            }
          }
        }
      }
    }

    const onLeave = () => {
      visible = false
      el.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] flex items-center justify-center rounded-full border border-gold max-lg:hidden"
      style={{
        width: 22,
        height: 22,
        opacity: 0,
        transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
        transition:
          'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.22s, border-color 0.22s, box-shadow 0.22s',
      }}
    >
      <span
        ref={label}
        className="pointer-events-none select-none font-semibold uppercase text-ink text-center transition-opacity duration-150"
        style={{
          opacity: 0,
          fontSize: '10px',
          lineHeight: 1,
          letterSpacing: '0.18em',
          textIndent: '0.18em', // Compensates for trailing letter spacing to achieve optical centering
          transform: 'translateY(0.5px)', // Optical vertical centering for uppercase font glyphs
        }}
      >
        View
      </span>
    </div>
  )
}
