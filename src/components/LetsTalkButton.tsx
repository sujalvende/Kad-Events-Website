import { useRef, useCallback } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { TLink } from '../lib/transition'
import { finePointer, reducedMotion } from '../lib/animations'

type Props = {
  className?: string
  to?: string
}

/**
 * Premium Architectural "LET'S TALK ↗" CTA Button
 * Faithfully matches KAD Events corporate design specification (media_1795198550541_ef74382c.png):
 * - Sharp rectangular silhouette (zero border radius)
 * - Rich warm gold solid background (#c5a46d / #d4af37) with solid black typography
 * - Clean uppercase sans-serif with wide tracking (tracking-[0.26em])
 * - Ambient golden back-glow halo blooming behind into the dark header
 * - Hover light sheen shimmer reflection sweep across the face
 * - Kinetic arrow travel lift (translate-x-1 -translate-y-1)
 * - Magnetic pointer attraction on desktop
 * - Tactile active micro-compression
 */
export default function LetsTalkButton({ className = '', to = '/contact' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const rect = useRef<DOMRect | null>(null)

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!finePointer() || reducedMotion() || !ref.current) return
    if (!rect.current) rect.current = ref.current.getBoundingClientRect()
    const r = rect.current
    const dx = (e.clientX - r.left - r.width / 2) * 0.18
    const dy = (e.clientY - r.top - r.height / 2) * 0.28
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`
  }, [])

  const onPointerLeave = useCallback(() => {
    rect.current = null
    if (ref.current) ref.current.style.transform = ''
  }, [])

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      {/* 1. Ambient Golden Back-Glow Halo (blooming outward into the dark background) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 bg-gold/30 blur-xl rounded-none transition-all duration-500 ease-out group-hover:scale-125 group-hover:bg-gold/50 group-hover:blur-2xl animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      {/* 2. Secondary soft radial aura for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 -inset-y-2 bg-amber-500/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60"
      />

      {/* 3. Solid Architectural Gold Button */}
      <TLink
        to={to}
        ref={ref}
        onPointerEnter={() => {
          if (ref.current) rect.current = ref.current.getBoundingClientRect()
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative z-10 inline-flex items-center justify-center gap-2.5 rounded-none bg-gold px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-ink shadow-[0_0_25px_rgba(212,175,55,0.45)] transition-[transform,shadow] duration-300 ease-out hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] active:scale-[0.98] select-none overflow-hidden"
      >
        {/* Luminous Light Sweep / Shimmer reflection sweep across the face on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-22deg] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[120%]"
        />

        {/* Text Label */}
        <span className="relative z-10 font-sans tracking-[0.26em] font-bold text-ink">
          LET'S TALK
        </span>

        {/* Kinetic Diagonal Arrow */}
        <span className="relative z-10 overflow-hidden inline-flex items-center justify-center">
          <ArrowUpRight
            size={16}
            strokeWidth={2.4}
            aria-hidden
            className="text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </TLink>
    </div>
  )
}
