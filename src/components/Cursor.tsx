import { useEffect, useRef } from 'react'
import { finePointer, reducedMotion } from '../lib/animations'

/**
 * Minimal ring cursor — optimised version:
 * - Uses a single RAF loop instead of GSAP tween on every pointer move
 * - Lerps position natively without creating new GSAP timelines
 * - Only spawns on fine-pointer desktop devices
 * - Cleans up completely on unmount
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!finePointer() || reducedMotion() || !ring.current) return

    const el = ring.current
    let targetX = -200, targetY = -200
    let currentX = -200, currentY = -200
    let size = 22, targetSize = 22
    let viewMode = false, targetViewMode = false
    let visible = false
    let rafId: number

    el.style.transform = 'translate(-50%, -50%)'
    el.style.opacity = '0'
    el.style.left = '0px'
    el.style.top = '0px'

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      rafId = requestAnimationFrame(tick)

      currentX = lerp(currentX, targetX, 0.18)
      currentY = lerp(currentY, targetY, 0.18)
      size = lerp(size, targetSize, 0.18)

      if (visible) {
        el.style.left = `${currentX}px`
        el.style.top = `${currentY}px`
        el.style.width = `${size}px`
        el.style.height = `${size}px`
        el.style.opacity = '1'
      }

      if (viewMode !== targetViewMode) {
        viewMode = targetViewMode
        if (viewMode) {
          el.style.backgroundColor = 'rgba(197,164,109,1)'
          if (label.current) label.current.style.opacity = '1'
        } else {
          el.style.backgroundColor = 'rgba(197,164,109,0)'
          if (label.current) label.current.style.opacity = '0'
        }
      }
    }

    rafId = requestAnimationFrame(tick)

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        currentX = e.clientX
        currentY = e.clientY
        visible = true
      }

      const t = (e.target as HTMLElement).closest?.('[data-cursor],a,button,select,summary')
      const isView = t?.getAttribute('data-cursor') === 'view'
      const isInteractive = !!t

      targetViewMode = isView
      targetSize = isView ? 92 : isInteractive ? 54 : 22
    }

    const onLeave = () => { visible = false; el.style.opacity = '0' }

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
      className="pointer-events-none fixed left-0 top-0 z-[80] grid place-items-center rounded-full border border-gold max-lg:hidden"
      style={{ width: 22, height: 22, opacity: 0, transition: 'border-color 0.3s' }}
    >
      <span ref={label} className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink" style={{ opacity: 0 }}>
        View
      </span>
    </div>
  )
}
