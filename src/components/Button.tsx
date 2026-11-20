import { useRef, useCallback, type ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { TLink } from '../lib/transition'
import { finePointer, reducedMotion } from '../lib/animations'

type Props = { to: string; children: ReactNode; variant?: 'solid' | 'outline'; className?: string }

/** Slide-fill button with arrow travel and a light magnetic pull on desktop.
 *  getBoundingClientRect is throttled via useCallback — only computed once per gesture. */
export default function Button({ to, children, variant = 'solid', className = '' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const rect = useRef<DOMRect | null>(null)
  const solid = variant === 'solid'

  const mag = useCallback((e: React.PointerEvent) => {
    if (!finePointer() || reducedMotion() || !ref.current) return
    if (!rect.current) rect.current = ref.current.getBoundingClientRect()
    const r = rect.current
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`
  }, [])

  const reset = useCallback(() => {
    rect.current = null
    if (ref.current) ref.current.style.transform = ''
  }, [])

  return (
    <TLink
      to={to}
      ref={ref}
      onPointerEnter={() => { if (ref.current) rect.current = ref.current.getBoundingClientRect() }}
      onPointerMove={mag}
      onPointerLeave={reset}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] transition-[transform,color,border-color] duration-300 ease-out ${solid ? 'bg-gold text-ink' : 'border border-white/30 text-snow hover:border-gold hover:text-ink'} ${className}`}
    >
      <span aria-hidden className={`absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-x-0 ${solid ? 'bg-snow' : 'bg-gold'}`} />
      <span className="relative">{children}</span>
      <ArrowUpRight size={15} aria-hidden className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
    </TLink>
  )
}
