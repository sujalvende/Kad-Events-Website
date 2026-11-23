import { useEffect, useRef } from 'react'
import { finePointer, reducedMotion } from '../lib/animations'

/**
 * Minimal ring cursor — hardware-accelerated performance version:
 * - Uses pure GPU-composited transform: translate3d(...) scale(...) — ZERO layout/reflow (no top/left/width/height mutations)
 * - Single RAF loop with smooth lerping
 * - Throttles DOM tree hover queries to avoid main-thread overhead
 * - Only runs on fine-pointer desktop devices (disabled on mobile touch)
 * - Cleans up cleanly on unmount
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
    let currentScale = 1, targetScale = 1
    let viewMode = false, targetViewMode = false
    let visible = false
    let rafId: number

    // Base cursor size is 22px
    const BASE_SIZE = 22

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      rafId = requestAnimationFrame(tick)

      currentX = lerp(currentX, targetX, 0.22)
      currentY = lerp(currentY, targetY, 0.22)
      currentScale = lerp(currentScale, targetScale, 0.22)

      if (visible) {
        // Pure compositor transform — zero layout or paint
        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale.toFixed(3)})`
        if (el.style.opacity !== '1') el.style.opacity = '1'
      }

      if (viewMode !== targetViewMode) {
        viewMode = targetViewMode
        if (viewMode) {
          el.style.backgroundColor = 'rgba(197, 164, 109, 1)'
          if (labelEl) labelEl.style.opacity = '1'
        } else {
          el.style.backgroundColor = 'rgba(197, 164, 109, 0)'
          if (labelEl) labelEl.style.opacity = '0'
        }
      }
    }

    rafId = requestAnimationFrame(tick)

    let lastTargetCheck = 0
    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        currentX = e.clientX
        currentY = e.clientY
        visible = true
      }

      // Throttle DOM tree lookups to at most once every 32ms (~30fps)
      const now = performance.now()
      if (now - lastTargetCheck > 32) {
        lastTargetCheck = now
        const t = (e.target as HTMLElement).closest?.('[data-cursor],a,button,select,summary')
        const isView = t?.getAttribute('data-cursor') === 'view'
        const isInteractive = !!t

        targetViewMode = isView
        targetScale = isView ? 92 / BASE_SIZE : isInteractive ? 54 / BASE_SIZE : 1
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
      className="pointer-events-none fixed left-0 top-0 z-[80] grid place-items-center rounded-full border border-gold max-lg:hidden will-change-transform"
      style={{
        width: 22,
        height: 22,
        opacity: 0,
        transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%) scale(1)',
        transition: 'background-color 0.25s, border-color 0.25s',
      }}
    >
      <span
        ref={label}
        className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink pointer-events-none transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        View
      </span>
    </div>
  )
}
